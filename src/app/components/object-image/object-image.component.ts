import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Obj, ObjectApiService } from "@neatnest/services";

@Component({
  selector: "app-object-image",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./object-image.component.html",
})
export class ObjectImageComponent {
  @Input({ required: true }) object!: Obj;

  @ViewChild("cameraInput") cameraInput!: ElementRef<HTMLInputElement>;
  @ViewChild("galleryInput") galleryInput!: ElementRef<HTMLInputElement>;

  isUploading: boolean = false;

  constructor(private objectApi: ObjectApiService) {}

  openCamera() {
    this.cameraInput.nativeElement.click();
  }

  openGallery() {
    this.galleryInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Selecione uma imagem");
      return;
    }
    this.uploadImage(file);
    input.value = "";
  }

  private uploadImage(file: File) {
    this.isUploading = true;

    this.objectApi.uploadImage(this.object.id, file).subscribe({
      next: (updatedObject) => {
        this.object.image = updatedObject.image ?? null;
        this.isUploading = false;
      },
      error: (err) => {
        console.error("Upload error:", err);
        alert("Falha ao enviar foto. Tente novamente.");
        this.isUploading = false;
      },
    });
  }

  deleteImage() {
    if (!confirm("Remover foto do objeto?")) return;

    this.objectApi.update(this.object.id, { image: null }).subscribe({
      next: () => {
        this.object.image = null;
      },
      error: () => alert("Erro ao remover imagem."),
    });
  }
}
