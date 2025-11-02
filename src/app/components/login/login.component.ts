import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ApiService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, FooterComponent, ArrowsComponent],
  templateUrl: "./login.component.html",
  styleUrls: ["../../../scss/pages/_login.scss"],
  animations: [fadeInOut],
})
export class LoginComponent {
  identifier: string = "";
  password: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) {}

  login() {
    this.isLoading = true;
    this.errorMessage = "";

    const body = { identifier: <string>this.identifier, password: <string>this.password };

    this.apiService.postData("auth/login", body).subscribe({
      next: (response) => {
        const access: string = response?.access_token;
        const refresh: string = response?.refresh_token;

        if (!access) {
          this.errorMessage = "Erro de login: token vazio";
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
        this.errorMessage = "Erro ao logar. Verifique suas credenciais.";
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
