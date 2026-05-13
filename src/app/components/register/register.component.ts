import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SupabaseAuthService, UserApiService } from "@neatnest/services";
import { ArrowsComponent, FooterComponent, fadeInOut } from "@neatnest/common";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

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
  isLoading = false;

  constructor(
    private router: Router,
    private supabaseAuth: SupabaseAuthService,
    private userApi: UserApiService
  ) {}

  async register() {
    this.isLoading = true;
    this.errorMessage = "";

    try {
      const { data, error } = await this.supabaseAuth.signup(this.email, this.password);

      if (error) {
        this.errorMessage = "Erro ao registar:" + error.message;
        this.isLoading = false;
        return;
      }

      const session = data.session;
      if (!session) {
        this.errorMessage = "Conta criada! Verifique seu e-mail para confirmar.";
        this.isLoading = false;
        return
      }

      const token = session.access_token;

      this.userApi.createProfile(this.name, token).pipe(
        catchError(err => {
          this.errorMessage = "Erro ao criar perfil no banco: " + (err.error?.message || "Erro desconhecido");
          this.isLoading = false;
          return of(null);
        })
      ).subscribe(res => {
        if (res) {
          localStorage.setItem("token", token);
          if (session.refresh_token) {
            localStorage.setItem("refresh_token", session.refresh_token);
          }
          this.isLoading = false;
          void this.router.navigate(["/dashboard"]);
        }
      });
    } catch (err) {
      this.errorMessage = "Erro interno no servidor.";
      this.isLoading = false;
    }
  }

  navigateToLogin() {
    void this.router.navigate(["/login"]);
  }
}
