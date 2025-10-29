import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import type { Container, Room } from "../../services/types";
import { RoomApiService } from "../../services/room-api.service";
import { ContainerApiService } from "../../services/container-api.service";

@Component({
  selector: "app-room",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  templateUrl: "./room.component.html",
})
export class RoomComponent {
  isLoading: boolean = true;
  errorMessage: string = "";

  roomId: string = "";
  room: Room | null = null;

  containers: Container[] = [];

  newContainerName: string = "";
  newContainerNumber: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomApi: RoomApiService,
    private containerApi: ContainerApiService,
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id") ?? "";
    if (!this.roomId) {
      this.errorMessage = "Invalid room id.";
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
          error: (err): void => {
            this.errorMessage = `Failed to load containers (${err?.status ?? "??"}).`;
            this.isLoading = false;
          },
        });
      },
      error: (err): void => {
        this.errorMessage = `Failed to load room (${err?.status ?? "??"}).`;
        this.isLoading = false;
      },
    });
  }

  createContainer(): void {
    if (!this.newContainerName.trim() || this.newContainerNumber == null) return;

    this.isLoading = true;
    this.errorMessage = "";

    this.containerApi
      .createInRoom(this.roomId, this.newContainerName.trim(), this.newContainerNumber)
      .subscribe({
        next: (created) => {
          this.containers = [created, ...this.containers];

          this.newContainerName = "";
          this.newContainerNumber = null;
          this.isLoading = false;
        },
        error: (err): void => {
          this.errorMessage = `Failed to create container (${err?.status ?? "??"}).`;
          this.isLoading = false;
        },
      });
  }

  openContainer(c: Container): void {
    void this.router.navigate([`/container/${c.id}`]);
  }

  backToHousehold(): void {
    void this.router.navigate(["/household"]);
  }
}
