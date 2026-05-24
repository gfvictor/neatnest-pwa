import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "neatnest-pwa";

  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === "VERSION_READY"))
        .subscribe(() => {
          if (confirm("Nova versão do NeatNest disponível! Clique em OK para atualizar.")) {
            void this.swUpdate.activateUpdate().then(() => window.location.reload());
          }
        });
      setTimeout(() => {
        void this.swUpdate.checkForUpdate();
      }, 5000);
      setInterval(() => {
        void this.swUpdate.checkForUpdate();
      }, 600000);
    }
  }
}
