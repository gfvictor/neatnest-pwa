import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ObjectApiService } from "@neatnest/services";
import type { Obj } from "@neatnest/services";
import { HeaderComponent, FooterComponent, ArrowsComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: 'app-object-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, ArrowsComponent],
  templateUrl: './object-edit.component.html',
  animations: [fadeInOut]
})
export class ObjectEditComponent implements OnInit {
  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string = "";

  objectId: string = "";
  currentName: string = "";
  currentQuantity: number = 1;
  currentCategory: string | undefined = undefined;
  newName: string = "";
  newQuantity: number = 1;
  newCategory: string | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private objectApi: ObjectApiService,
  ) {}

  ngOnInit(): void {
    this.objectId = this.route.snapshot.paramMap.get("id") ?? "";
    if (!this.objectId) {
      this.errorMessage = "ID do objeto inválido.";
      this.isLoading = false;
      return;
    }

    this.objectApi.getById(this.objectId).subscribe({
      next: (obj: Obj) => {
        this.currentName = obj.name;
        this.currentQuantity = obj.quantity;
        this.currentCategory = obj.category ?? undefined;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Falha ao carregar o objeto.";
        this.isLoading = false;
      }
    });
  }

  saveObject(): void {
    this.isSaving = true;
    this.errorMessage = "";

    const payload: Partial<Pick<Obj, "name" | "quantity" | "category">> = {};

    if (this.newName.trim()) payload.name = this.newName.trim();
    if (this.newQuantity != null) payload.quantity = this.newQuantity;
    if (this.newCategory != undefined) payload.category = this.newCategory.trim();

    this.objectApi.update(this.objectId, payload).subscribe({
      next: () => {
        this.location.back();
      },
      error: () => {
        this.errorMessage = "Falha ao salvar as alterações.";
        this.isSaving = false;
      }
    });
  }

  confirmAndSave(): void {
    if (confirm("Tem certeza que deseja alterar os dados do objeto?")) {
      this.saveObject();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
