import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Obj } from "../../services/types";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjectApiService } from "../../services/object-api.service";

@Component({
  selector: "app-object",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  templateUrl: "./object.component.html",
})
export class ObjectComponent {
  objects: Obj[] = [];
  containerId: string = "";

  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private objectApi: ObjectApiService,
  ) {}

  ngOnInit(): void {
    this.containerId = this.route.snapshot.paramMap.get("containerId") ?? "";
  }

  deleteObject(id: string): void {
    this.isLoading = true;
    this.errorMessage = "";

    this.objectApi.delete(id).subscribe({
      next: (): void => {
        this.objects = this.objects.filter((o: Obj) => o.id !== id);
        this.isLoading = true;
      },
      error: (): void => {
        this.errorMessage = "Failed to delete object";
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    void this.router.navigate(["/container", this.containerId]);
  }
}
