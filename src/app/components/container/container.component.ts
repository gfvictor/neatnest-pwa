import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, NgOptimizedImage, Location } from "@angular/common";
import type { ContainerObjects, Obj } from "@neatnest/services";
import { ContainerApiService } from "@neatnest/services";
import { FormsModule } from "@angular/forms";
import { ObjectApiService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, LogoComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-container",
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    LogoComponent,
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
        this.errorMessage = "Falha ao carregar Container.";
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
      error: (): void => {
        this.errorMessage = "Falha ao carregar Objeto";
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
          this.newObjQuantity = this.newObjQuantity ?? 1;
          this.newObjCategory = "";
          this.isCreating = false;
        },
        error: (): void => {
          this.errorMessage = "Falha ao criar Objeto";
          this.isCreating = false;
        },
      });
  }

  backToRoom(): void {
    void this.location.back();
  }
}
