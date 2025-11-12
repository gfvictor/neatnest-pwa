import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ObjectApiService, Obj } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, LogoComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-object",
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent, FooterComponent, ArrowsComponent],
  templateUrl: "./object.component.html",
  styleUrls: [],
  animations: [fadeInOut],
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
