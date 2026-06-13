import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RoomApiService, Room } from "@neatnest/services";
import { HeaderComponent, FooterComponent, ArrowsComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: 'app-room-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, ArrowsComponent],
  templateUrl: './room-edit.component.html',
  animations: [fadeInOut]
})
export class RoomEditComponent implements OnInit {
  isLoading: boolean = true;
  isSaving: boolean = false;
  errorMessage: string = "";

  roomId: string = "";
  currentName: string = "";
  newName: string = "";

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private roomApi: RoomApiService,
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id") ?? "";
    if (!this.roomId) {
      this.errorMessage = "ID do cômodo inválido.";
      this.isLoading = false;
      return;
    }

    this.roomApi.getById(this.roomId).subscribe({
      next: (room: Room) => {
        this.currentName = room.name;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Falha ao carregar cômodo";
        this.isLoading = false;
      }
    });
  }

  saveRoom(): void {;
    this.isSaving = true;
    this.errorMessage = "";

    this.roomApi.update(this.roomId, { name: this.newName.trim() }).subscribe({
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
    if (!this.newName.trim()) {
      this.goBack();
      return;
    }

    if (confirm("Tem certeza que deseja alterar?")) {
      this.saveRoom();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
