import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SupabaseAuthService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, fadeInOut } from "@neatnest/common";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, FooterComponent, ArrowsComponent],
  templateUrl: "./register.component.html",
  styleUrls: ['../../../scss/pages/_login.scss'],
  animations: [fadeInOut],
})
export class RegisterComponent {
  name = "";
  email = "";
  password = "";
  errorMessage = "";
  successMessage = "";
  isLoading = false;

  constructor(
    private router: Router,
    private supabaseAuth: SupabaseAuthService,
  ) {}

  async register() {
    this.isLoading = true;
    this.errorMessage = "";
    this.successMessage = "";

    try {
      const { data, error } = await this.supabaseAuth.signup(this.email, this.password, this.name);

      if (error) {
        this.errorMessage = "Erro ao registar: " + error.message;
        this.isLoading = false;
        return;
      }

      this.successMessage = "Conta criada! Verifique seu e-mail para confirmar.";
      this.isLoading = false;

    }  catch (err) {
      this.errorMessage = "Erro interno no servidor.";
      this.isLoading = false;
    }
  }

  navigateToLogin() {
    void this.router.navigate(["/login"]);
  }
}
