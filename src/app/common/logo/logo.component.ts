import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-logo",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./logo.component.html",
})
export class LogoComponent {}
