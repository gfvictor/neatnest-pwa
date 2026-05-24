import { HeaderComponent } from "../header/header.component";
import { Component, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, NgOptimizedImage, Location } from "@angular/common";
import type { ContainerObjects, Obj } from "@neatnest/services";
import { ContainerApiService } from "@neatnest/services";
import { FormsModule } from "@angular/forms";
import { ObjectApiService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, fadeInOut } from "@neatnest/common";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-container",
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    HeaderComponent,
    ArrowsComponent,
    FooterComponent,
  ],
  templateUrl: "./container.component.html",
  styleUrls: ["../../../scss/pages/_container.scss"],
  animations: [fadeInOut],
})
export class ContainerComponent {
  isLoading: boolean = false;
  isCreating: boolean = false;
  errorMessage: string = "";
  activeMenuId: string | null = null;

  roomId: string = "";

  containerId: string = "";
  container: ContainerObjects | null = null;

  objects: Obj[] = [];
  newObjName: string = "";
  newObjQuantity: number | null = null;
  newObjCategory: string = "";

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private containerApi: ContainerApiService,
    private objectApi: ObjectApiService,
  ) {}

  ngOnInit(): void {
    this.containerId = this.route.snapshot.paramMap.get("containerId") ?? "";
    this.roomId = this.route.snapshot.paramMap.get("roomId") ?? "";
    if (!this.containerId) {
      this.errorMessage = "Container com ID inválido.";
      return;
    }

    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = "";

    forkJoin({
      container: this.containerApi.getById(this.containerId),
      objects: this.objectApi.listByContainer(this.containerId),
    }).subscribe({
      next: (result): void => {
        this.container = result.container;
        this.objects = result.objects;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Falha ao carregar dados.";
        this.isLoading = false;
      },
    });
  }

  createObject(): void {
    if (!this.newObjName.trim()) return;

    this.isCreating = true;
    this.errorMessage = "";

    this.objectApi
      .create(
        this.containerId,
        this.newObjName.trim(),
        this.newObjQuantity ?? 1,
        this.newObjCategory || undefined,
      )
      .subscribe({
        next: (obj: Obj): void => {
          this.objects = [obj, ...this.objects];
          this.newObjName = "";
          this.newObjQuantity = null;
          this.newObjCategory = "";
          this.isCreating = false;
        },
        error: (): void => {
          this.errorMessage = "Falha ao criar Objeto";
          this.isCreating = false;
        },
      });
  }

  confirmDelete(name: string, deleteAction: () => void): void {
    const confirmed = window.confirm(`Deseja excluir [ ${name} ] ?`);
    if (confirmed) {
      deleteAction();
    }
  }

  deleteObject(id: string, name: string): void {
    this.confirmDelete(name, () => {
      this.isLoading = true;
      this.errorMessage = "";

      this.objectApi.delete(id).subscribe({
        next: (): void => {
          this.objects = this.objects.filter((o: Obj) => o.id !== id);
          this.isLoading = false;
        },
        error: (): void => {
          this.errorMessage = "Failed to delete object";
          this.isLoading = false;
        },
      });
    });
  }

  trackByObjId(index: number, obj: Obj): string {
    return obj.id;
  }

  toggleMenu(id: string) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }

  @HostListener("document:click")
  closeMenu() {
    this.activeMenuId = null;
  }

  backToRoom(): void {
    void this.location.back();
  }
}
