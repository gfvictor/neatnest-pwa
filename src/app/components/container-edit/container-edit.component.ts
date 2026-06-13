import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ContainerApiService, Container } from "@neatnest/services";
import { HeaderComponent, FooterComponent, ArrowsComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: 'app-container-edit',
  standalone: true,
  imports: [CommonModule,FormsModule, HeaderComponent, FooterComponent, ArrowsComponent],
  templateUrl: './container-edit.component.html',
  animations: [fadeInOut],
})
export class ContainerEditComponent implements OnInit {
  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string = "";

  containerId: string = "";
  currentName: string = "";
  currentNumber: number | undefined = undefined;
  newName: string = "";
  newNumber: number | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private containerService: ContainerApiService,
  ) {}

  ngOnInit(): void {
    this.containerId = this.route.snapshot.paramMap.get("containerId") ?? "";
    if (!this.containerId) {
      this.errorMessage = "ID do container inválido.";
      this.isLoading = false;
      return;
    }

    this.containerService.getById(this.containerId).subscribe({
      next: (container: Container) => {
        this.currentName = container.name;
        this.currentNumber = container.number ?? undefined;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Falha ao carregar container";
        this.isLoading = false;
      }
    });
  }

  saveContainer(): void {
    this.isSaving = true;
    this.errorMessage = "";

    const payload: Partial<Pick<Container, "name" | "number">> = {};

    if (this.newName.trim()) payload.name = this.newName.trim();
    if (this.newNumber != null) payload.number = this.newNumber;

    this.containerService.update(this.containerId, payload).subscribe({
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
    if (!this.newName.trim() && this.newNumber == null) {
      this.goBack();
      return;
    }

    if (confirm("Tem certeza que deseja salvar as alterções?")) {
      this.saveContainer();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
