import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  identifier: string = "";
  password: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  login() {
    this.isLoading = true;
    this.errorMessage = "";

    type LoginResponse = {
      access_token: string;
      refresh_token: string;
    };

    const body = { identifier: <string>this.identifier, password: <string>this.password };
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post<LoginResponse>("https://neatnest.vercel.app/auth/login", body, { headers })
      .subscribe({
        next: (response) => {
          const access = response?.access_token;
          const refresh = response?.refresh_token;

          if (!access) {
            this.errorMessage = "Login error: missing token.";
            this.isLoading = false;
            return;
          }

          localStorage.setItem("token", access);
          localStorage.setItem("refresh_token", refresh);
          this.isLoading = false;
          setTimeout(() => {
            void this.router.navigate(["/dashboard"]);
          }, 100);
        },
        error: () => {
          this.errorMessage = "Login error. Verify your credentials.";
          this.isLoading = false;
        },
      });
  }

  navigateToRecovery() {
    void this.router.navigate(["/recovery"]);
  }

  navigateToRegister() {
    void this.router.navigate(["/register"]);
  }
}
