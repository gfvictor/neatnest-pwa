import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Router} from '@angular/router';
import {HouseholdApiService} from '../../services/household-api.service';
import type {HouseholdRelations, Room} from '../../services/types';
import {RoomApiService} from '../../services/room-api.service';
import {FormsModule} from '@angular/forms';

@Component({
    selector: 'app-household',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, FormsModule],
    templateUrl: './household.component.html',
    styleUrl: './household.component.css'
})
export class HouseholdComponent {
    household: HouseholdRelations | null = null;
    rooms: Room[] = [];
    errorMessage: string = ''
    isLoading: boolean = false;

    newRoomName = '';

    constructor(private router: Router, private householdApi: HouseholdApiService, private roomApi: RoomApiService) {
    }

    ngOnInit(): void {
        this.loadHousehold();
    }

    private loadHousehold(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.householdApi.getCurrent().subscribe({
            next: (household) => {
                this.household = household

                this.roomApi.listByHousehold().subscribe({
                    next: (rooms: Room[]) => {
                        this.rooms = rooms;
                        this.isLoading = false;
                    },
                    error: (err) => {
                        this.errorMessage = 'Failed to load rooms.';
                        this.isLoading = false;
                        console.error(err);
                    },
                });
            },
            error: (err) => {
                this.errorMessage = 'Failed to load Household.';
                this.isLoading = false;
                console.error(err);
            },
        });
    }

    createRoom(): void {
        if (!this.newRoomName.trim()) return;

        this.isLoading = true;
        this.errorMessage = '';

        this.roomApi.create(this.newRoomName.trim()).subscribe({
            next: (room: Room) => {
                this.rooms = [room, ...this.rooms];
                this.newRoomName = '';
                this.isLoading = false;
            },
            error: (err) => {
                this.errorMessage = 'Failed to create Room.';
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    openRoom(room: Room): void {
        void this.router.navigate(['/room', room.id]);
    }

    goBack(): void {
        void this.router.navigate(['/dashboard']);
    }

    backPage(): void {
        this.isLoading = true;

        this.isLoading = false;
        void this.router.navigate(['/dashboard']);
        return;
    }
}
