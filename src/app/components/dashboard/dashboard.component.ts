import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { ArrowsComponent, FooterComponent, LogoComponent, fadeInOut } from "@neatnest/common";
import { environment } from "@neatnest/environments";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, LogoComponent, FooterComponent, ArrowsComponent],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["../../../scss/pages/_dashboard.scss"],
  animations: [fadeInOut],
})
export class DashboardComponent {
  homeUse: boolean = false;
  workUse: boolean = false;
  isLoading: boolean = false;
  currentUser: string = "";

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  async ngOnInit(): Promise<void> {
    const token: string | null = localStorage.getItem("token");
    if (!token) {
      await this.router.navigate(["/login"]);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .get<{
        homeUse: boolean;
        workUse: boolean;
        name: string;
      }>(`${environment.apiUrl}/user/current`, { headers })
      .subscribe({
        next: (user) => {
          this.homeUse = user.homeUse;
          this.workUse = user.workUse;
          this.currentUser = user.name || "Usuário";
          this.isLoading = false;
        },
        error: (err) => {
          console.error("GET /user/current failed:", err);

          if (err?.status === 401 || err?.status === 403) {
            localStorage.removeItem("token");
            void this.router.navigate(["/login"]);
          } else {
            this.isLoading = false;
          }
        },
      });
  }

  goToHousehold(): void {
    void this.router.navigate(["/household"]);
  }

  goToWorkplace(): void {
    void this.router.navigate(["/workplace"]);
  }

  logout(): void {
    this.isLoading = true;

    const token = localStorage.getItem("token");
    if (!token) {
      this.isLoading = false;
      void this.router.navigate(["/login"]);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(`${environment.apiUrl}/auth/logout`, {}, { headers }).subscribe({
      next: () => {
        localStorage.removeItem("token");
        this.isLoading = false;
        void this.router.navigate(["/login"]);
      },
      error: () => {
        localStorage.removeItem("token");
        this.isLoading = false;
        void this.router.navigate(["/login"]);
      },
    });
  }
}
