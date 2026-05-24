import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from "rxjs/operators";
import { Subject, of } from "rxjs";
import { LogoComponent } from "@neatnest/common";
import { SearchService, SearchResults } from "@neatnest/services";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LogoComponent],
  templateUrl: "./header.component.html",
  styleUrls: ["../../../../scss/components/_header.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchControl = new FormControl("");
  searchResults: SearchResults | null = null;
  isSearching: boolean = false;

  private currentScope: "household" | "workplace" | undefined = undefined;
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateScopeFromUrl(this.router.url);

    this.router.events
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (event) => {
          if (event instanceof NavigationEnd) {
            this.updateScopeFromUrl(event.urlAfterRedirects);
            this.clearSearch();
          }
        }
      });

    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        // O tap intercepta a digitação IMEDIATAMENTE antes do delay do debounce
        tap(query => {
          if (query && query.trim().length > 0) {
            this.isSearching = true;
            // Inicializa um objeto vazio para o dropdown abrir e mostrar "Buscando..."
            if (!this.searchResults) {
              this.searchResults = { objects: [], containers: [], rooms: [], sections: [] };
            }
          } else {
            this.isSearching = false;
            this.searchResults = null;
          }
        }),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query || query.trim().length === 0) {
            return of(null);
          }
          return this.searchService.globalSearch(query, this.currentScope);
        })
      )
      .subscribe({
        next: (results) => {
          if (results) {
            this.searchResults = results;
          }
          this.isSearching = false;
        },
        error: (err) => {
          console.error("Falha na busca global", err);
          this.isSearching = false;
          this.searchResults = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateScopeFromUrl(url: string): void {
    if (url.includes("/household") || url.includes("/room") || url.includes("/container") || url.includes("/object")) {
      this.currentScope = "household";
    } else if (url.includes("/workplace") || url.includes("/section")) {
      this.currentScope = "workplace"
    } else {
      this.currentScope = undefined;
    }
  }

  clearSearch(): void {
    this.searchControl.setValue("", { emitEvent: false });
    this.searchResults = null;
  }

  goToDashboard(): void {
    void this.router.navigate(["/dashboard"]);
  }

  @HostListener("document:click")
  closeSearchMenu(): void {
    this.searchResults = null;
  }
}

