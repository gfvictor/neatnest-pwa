import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, NgOptimizedImage],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    identifier: string = '' ;
    password: string = '';
    errorMessage: string = '';
    isLoading: boolean = false;
    isFadingOut: boolean = false;


    constructor(private router: Router, private http: HttpClient) {}


    login() {
        this.isLoading = true;
        this.errorMessage = '';

        const body = { identifier: <string> this.identifier, password: <string> this.password };
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.post<{ accessToken: string }>('https://neatnest.vercel.app/auth/login', body, { headers })
            .subscribe({
                next: (response: { accessToken: string }) => {
                    localStorage.setItem('token', response.accessToken);
                    this.isLoading = false;
                    void this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.errorMessage = 'Login error. Verify your credentials.'
                    this.isLoading = false;
                }
            });
    }

    navigateToRecovery() {
        void this.router.navigate(['/recovery']);
    }

    navigateToRegister() {
        void this.router.navigate(['/register']);
    }
}
