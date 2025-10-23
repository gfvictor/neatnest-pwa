import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
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
