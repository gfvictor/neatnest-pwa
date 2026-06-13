import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SupabaseAuthService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, FooterComponent, ArrowsComponent],
  templateUrl: "./login.component.html",
  animations: [fadeInOut],
})
export class LoginComponent {
  identifier: string = "";
  password: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private supabaseAuth: SupabaseAuthService,
  ) {}

  async login() {
      this.isLoading = true;
      this.errorMessage = "";

  try {
      const { data, error } = await this.supabaseAuth.login(this.identifier, this.password);

      if (error) {
        this.errorMessage = error.message.includes("Email not confirmed")
          ? "Por favor, confirme o seu e-mail antes de fazer login."
          : "Erro ao fazer login. Verifique suas credenciais."
        this.isLoading = false;
        return;
      }

      const access = data.session?.access_token;
      const refresh = data.session?.refresh_token;

      if (!access) {
          this.errorMessage = "Erro de login: token vazio";
          this.isLoading = false;
          return;
      }

      localStorage.setItem("token", access);
      if (refresh) {
          localStorage.setItem("refresh_token", refresh);
      }

     this.isLoading = false;
      setTimeout(() => {
          void this.router.navigate(["/dashboard"]);
      }, 100);

  } catch (err) {
      this.errorMessage = "Erro interno no servidor.";
      this.isLoading = false;
  }
}

  navigateToRecovery() {
    void this.router.navigate(["/recovery"]);
  }

  navigateToRegister() {
    void this.router.navigate(["/register"]);
  }
}
