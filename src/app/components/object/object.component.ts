import { HeaderComponent } from "../header/header.component";
import { Component, ViewChild } from "@angular/core";
import { CommonModule, Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjectApiService, Obj, ContainerApiService, RoomApiService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, fadeInOut } from "@neatnest/common";
import { ObjectImageComponent } from "../object-image/object-image.component";

@Component({
  selector: "app-object",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ArrowsComponent,
    ObjectImageComponent,
  ],
  templateUrl: "./object.component.html",
  styleUrls: ["../../../scss/pages/_object.scss"],
  animations: [fadeInOut],
})
export class ObjectComponent {
  @ViewChild(ObjectImageComponent) objectImageComponent!: ObjectImageComponent;

  isLoading: boolean = true;
  errorMessage: string = "";

  roomId: string | null = null;
  roomName: string = "";
  containerId: string | null = null;
  containerName: string = "";

  object: Obj | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private objectApi: ObjectApiService,
    private containerApi: ContainerApiService,
    private roomApi: RoomApiService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (!id) {
      this.errorMessage = "Objeto com ID inválido.";
      this.isLoading = false;
      return;
    }
    this.loadObject(id);
  }

  addOrReplaceImage(): void {
    if (this.objectImageComponent) {
        this.objectImageComponent.openGallery();
    }
  }

  private loadObject(id: string): void {
    this.isLoading = true;
    this.objectApi.getById(id).subscribe({
      next: (obj) => {
        this.object = obj;

        if (!obj.containerId) {
          this.containerName = "Container não encontrado.";
          this.roomName = "Localização indisponível.";
          this.isLoading = false;
          return;
        }

        this.loadLocation(obj.containerId);
      },
      error: () => {
        this.errorMessage = "Falha ao carregar objeto.";
        this.isLoading = false;
      },
    });
  }

  private loadLocation(containerId: string) {
    this.containerApi.getById(containerId).subscribe({
      next: (container) => {
        this.containerName = container.name || "Sem nome";

        if (container.roomId) {
          this.roomApi.getById(container.roomId).subscribe({
            next: (room) => {
              this.roomName = room.name || "Sem cômodo";
            },
            error: () => {
              this.errorMessage = "Cômodo desconhecido.";
            },
            complete: () => {
              this.isLoading = false;
            },
          });
        } else {
          this.roomName = "Sem cômodo.";
          this.isLoading = false;
        }
      },
      error: () => {
        this.containerName = "Container desconhecido.";
        this.roomName = "Cômodo desconhecido.";
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    void this.location.back();
  }
}
