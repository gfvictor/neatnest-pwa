import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HouseholdApiService, HouseholdRelations, Room, RoomApiService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, LogoComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-household",
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent, FooterComponent, ArrowsComponent],
  templateUrl: "./household.component.html",
  styleUrls: ["../../../scss/pages/_household.scss"],
  animations: [fadeInOut],
})
export class HouseholdComponent {
  household: HouseholdRelations | null = null;
  rooms: Room[] = [];
  errorMessage: string = "";
  isLoading: boolean = false;

  newRoomName: string = "";

  constructor(
    private router: Router,
    private householdApi: HouseholdApiService,
    private roomApi: RoomApiService,
  ) {}

  ngOnInit(): void {
    this.loadHousehold();
  }

  private loadHousehold(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.householdApi.getCurrent().subscribe({
      next: (household) => {
        this.household = household;

        this.roomApi.listByHousehold().subscribe({
          next: (rooms: Room[]) => {
            this.rooms = rooms;
            this.isLoading = false;
          },
          error: (err) => {
            this.errorMessage = "Falha ao carregar Cômodos.";
            this.isLoading = false;
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.errorMessage = "Falha ao carregar Casa.";
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  createRoom(): void {
    if (!this.newRoomName.trim()) return;

    this.isLoading = true;
    this.errorMessage = "";

    this.roomApi.create(this.newRoomName.trim()).subscribe({
      next: (room: Room) => {
        this.rooms = [room, ...this.rooms];
        this.newRoomName = "";
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Falha ao criar Cômodo.";
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  deleteRoom(id: string): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.roomApi.delete(id).subscribe({
      next: () => {
        this.rooms = this.rooms.filter((r: Room): boolean => r.id !== id);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Falha ao deletar Cômodo.";
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  openRoom(room: Room): void {
    void this.router.navigate(["/room", room.id]);
  }

  goBack(): void {
    void this.router.navigate(["/dashboard"]);
  }
}
