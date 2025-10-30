import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-splash",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./splash.component.html",
})
export class SplashComponent {
  isFadingOut: false | any;

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.isFadingOut = true;
      setTimeout(() => {
        void this.router.navigate(["/login"]);
      }, 800);
    }, 3000);
  }
}
