import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import type { ContainerObjects, Obj } from "../../services/types";
import { ContainerApiService } from "../../services/container-api.service";
import { FormsModule } from "@angular/forms";
import { ObjectApiService } from "../../services/object-api.service";

@Component({
  selector: "app-container",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  templateUrl: "./container.component.html",
})
export class ContainerComponent {
  isLoading: boolean = false;
  isCreating: boolean = false;
  errorMessage: string = "";

  roomId: string = "";

  containerId: string = "";
  container: ContainerObjects | null = null;

  objects: Obj[] = [];
  newObjName: string = "";
  newObjQuantity: number = 1;
  newObjCategory: string = "";

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private containerApi: ContainerApiService,
    private objectApi: ObjectApiService,
  ) {}

  ngOnInit(): void {
    this.containerId = this.route.snapshot.paramMap.get("containerId") ?? "";
    this.roomId = this.route.snapshot.paramMap.get("roomId") ?? "";
    if (!this.containerId) {
      this.errorMessage = "Invalid Container Id";
      return;
    }

    this.loadContainer();
    this.loadObjects();
  }

  private loadContainer(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.containerApi.getById(this.containerId).subscribe({
      next: (container: ContainerObjects) => {
        this.container = container;
        this.isLoading = false;
      },
      error: (): void => {
        this.errorMessage = "Failed to load container";
        this.isLoading = false;
      },
    });
  }

  private loadObjects(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.objectApi.listByContainer(this.containerId).subscribe({
      next: (objects: Obj[]): void => {
        this.objects = objects;
        this.isLoading = false;
      },
      error: (err): void => {
        this.errorMessage = "Failed to load objects";
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
        this.newObjQuantity,
        this.newObjCategory || undefined,
      )
      .subscribe({
        next: (obj: Obj): void => {
          this.objects = [obj, ...this.objects];
          this.newObjName = "";
          this.newObjQuantity = 1;
          this.newObjCategory = "";
          this.isCreating = false;
        },
        error: (): void => {
          this.errorMessage = "Failed to create object";
          this.isCreating = false;
        },
      });
  }

  backToRoom(): void {
    if (this.roomId) {
      void this.router.navigate(["/room/", this.roomId]);
    } else {
      void this.router.navigate(["/household"]);
    }
  }
}
