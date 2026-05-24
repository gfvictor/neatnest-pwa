import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@neatnest/environments"
import { Objects, Container, Room, Section } from "@neatnest/common"

export interface SearchResults {
  objects: Objects[];
  containers: Container[];
  rooms: Room[];
  sections: Section[];
}

@Injectable({
  providedIn: "root"
})
export class SearchService {
  private readonly baseUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem("token");
    return new HttpHeaders().set("Authorization", `Bearer ${token}`);
  }

  globalSearch(query: string, scope?: "household" | "workplace"): Observable<SearchResults> {
    let params = new HttpParams().set("q", query);

    if (scope) {
      params = params.set("scope", scope);
    }

    const headers = this.getHeaders();
    return this.http.get<SearchResults>(this.baseUrl, { headers, params });
  }
}
