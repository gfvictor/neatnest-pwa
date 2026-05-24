import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from "@angular/core";
import { PreloadAllModules, provideRouter, withPreloading } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideServiceWorker } from "@angular/service-worker";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./common/interceptors/auth.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:5000",
    }),
  ],
};
