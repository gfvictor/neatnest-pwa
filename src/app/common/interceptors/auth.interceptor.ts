import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, switchMap } from "rxjs/operators";
import { throwError, from } from "rxjs";
import { createClient } from "@supabase/supabase-js";
import { environment } from "@neatnest/environments";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
        
        return from(supabase.auth.getSession()).pipe(
          switchMap(({ data, error: sessionError }) => {
            if (data.session && !sessionError) {
              localStorage.setItem("token", data.session.access_token);
              localStorage.setItem("refresh_token", data.session.refresh_token);
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${data.session.access_token}`
                }
              });
              return next(clonedRequest);
            } else {
              localStorage.removeItem("token");
              localStorage.removeItem("refresh_token");
              void router.navigate(["/login"]);
              return throwError(() => error);
            }
          })
        );
      }
      if (error.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        void router.navigate(["/login"]);
      }

      return throwError(() => error);
    })
  );
};
