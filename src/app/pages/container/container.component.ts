import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import type { ContainerObjects } from "../../services/types";
import { ContainerApiService } from "../../services/container-api.service";

@Component({
  selector: "app-container",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./container.component.html",
})
export class ContainerComponent implements OnInit {
  container: ContainerObjects | null = null;
  isLoading = true;
  errorMessage = "";
  containerId!: string;
  roomId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private containerApi: ContainerApiService,
  ) {}

  ngOnInit(): void {
    this.containerId = this.route.snapshot.paramMap.get("id")!;
    this.roomId = this.route.snapshot.queryParamMap.get("roomId") ?? "";

    this.loadContainer();
  }

  loadContainer(): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.containerApi.getById(this.containerId).subscribe({
      next: (data) => {
        this.container = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Failed to load container";
        this.isLoading = false;
      },
    });
  }

  backToRoom(): void {
    if (this.roomId) {
      void this.router.navigate([`/room/${this.roomId}`]);
    } else {
      void this.router.navigate(["/household"]);
    }
  }
}
