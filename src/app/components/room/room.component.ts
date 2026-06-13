import { Component, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { Room, RoomApiService, Container, ContainerApiService } from "@neatnest/services";
import { ArrowsComponent, HeaderComponent, FooterComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-room",
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent, ArrowsComponent, HeaderComponent],
  templateUrl: "./room.component.html",
  animations: [fadeInOut],
})
export class RoomComponent {
  isLoading: boolean = true;
  errorMessage: string = "";
  activeMenuId: string | null = null;

  roomId: string = "";
  room: Room | null = null;

  containers: Container[] = [];

  newContainerName: string = "";
  newContainerNumber: number | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomApi: RoomApiService,
    private containerApi: ContainerApiService,
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id") ?? "";
    if (!this.roomId) {
      this.errorMessage = "Cômodo com ID inválido.";
      this.isLoading = false;
      return;
    }
    this.loadRoomAndContainer();
  }

  private loadRoomAndContainer(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.roomApi.getById(this.roomId).subscribe({
      next: (room) => {
        this.room = room;

        this.containerApi.listByLocation(this.roomId).subscribe({
          next: (all: Container[]) => {
            this.containers = (all ?? []).filter((c) => c.roomId === this.roomId);
            this.isLoading = false;
          },
          error: (): void => {
            this.errorMessage = "Falha ao carregar Containers.";
            this.isLoading = false;
          },
        });
      },
      error: (): void => {
        this.errorMessage = "Falha ao carregar Cômodo.";
        this.isLoading = false;
      },
    });
  }

  createContainer(): void {
    const containerName: string = this.newContainerName.trim();
    if (!containerName) return;

    this.isLoading = true;
    this.errorMessage = "";

    const containerNumber =
      this.newContainerNumber !== null && this.newContainerNumber !== undefined
        ? this.newContainerNumber
        : undefined;

    this.containerApi.createInRoom(this.roomId, containerName, containerNumber).subscribe({
      next: (created) => {
        this.containers = [created, ...this.containers];

        this.newContainerName = "";
        this.newContainerNumber = undefined;
        this.isLoading = false;
      },
      error: (): void => {
        this.errorMessage = "Falha ao criar Container.";
        this.isLoading = false;
      },
    });
  }

  confirmDelete(name: string, deleteAction: () => void): void {
    const confirmed = window.confirm(`Deseja excluir [ ${name} ] ?`);
    if (confirmed) {
      deleteAction();
    }
  }

  deleteContainer(id: string, name: string): void {
    this.confirmDelete(name, (): void => {
      this.isLoading = true;
      this.errorMessage = "";

      this.containerApi.delete(id).subscribe({
        next: () => {
          this.containers = this.containers.filter((c: Container): boolean => c.id !== id);
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = "Falha ao excluir container.";
          this.isLoading = false;
        },
      });
    });
  }

  toggleMenu(id: string) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  @HostListener("document:click")
  closeMenu() {
    this.activeMenuId = null;
  }

  goToEditContainer(id: string): void {
    void this.router.navigate(["/container/edit", id]);
  }

  openContainer(c: Container): void {
    void this.router.navigate(["/container", c.id]);
  }

  backToHousehold(): void {
    void this.router.navigate(["/household"]);
  }
}
