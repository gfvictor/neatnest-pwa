import { Injectable } from "@angular/core";
import { environment } from "@neatnest/environments";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import type { Room, RoomContainers } from "./types";

@Injectable({
  providedIn: "root",
})
export class RoomApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token: string = localStorage.getItem("token") ?? "";

    return new HttpHeaders().set("Authorization", `Bearer ${token}`);
  }

  listByHousehold(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/room`, { headers: this.authHeaders() });
  }

  getById(id: string): Observable<RoomContainers> {
    return this.http.get<RoomContainers>(`${this.apiUrl}/room/${id}`, {
      headers: this.authHeaders(),
    });
  }

  create(name: string): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/room`, { name }, { headers: this.authHeaders() });
  }

  update(id: string, data: Partial<Pick<Room, "name">>): Observable<Room> {
    return this.http.patch<Room>(`${this.apiUrl}/room/${id}`, data, {
      headers: this.authHeaders(),
    });
  }

  delete(id: string): Observable<{ success: boolean } | Room> {
    return this.http.delete<{ success: boolean } | Room>(`${this.apiUrl}/room/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
