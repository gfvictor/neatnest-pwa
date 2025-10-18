import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import type { Container, ContainerObjects } from "./types";

@Injectable({
  providedIn: "root",
})
export class ContainerApiService {
  private readonly apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token: string = localStorage.getItem("token") ?? "";

    return new HttpHeaders().set("Authorization", `Bearer ${token}`);
  }

  listByLocation(roomId: string): Observable<Container[]> {
    const headers = this.authHeaders();
    const params = { roomId };

    return this.http.get<Container[]>(`${this.apiUrl}/container`, { headers, params });
  }

  getById(id: string): Observable<ContainerObjects> {
    return this.http.get<ContainerObjects>(`${this.apiUrl}/container/${id}`, {
      headers: this.authHeaders(),
    });
  }

  createInRoom(roomId: string, name: string, number: number): Observable<ContainerObjects> {
    return this.http.post<Container>(
      `${this.apiUrl}/container`,
      { roomId, name, number },
      { headers: this.authHeaders() },
    );
  }

  update(id: string, data: Partial<Pick<Container, "name" | "number">>): Observable<Container> {
    return this.http.patch<Container>(`${this.apiUrl}/container/${id}`, data, {
      headers: this.authHeaders(),
    });
  }

  uploadImage(containerId: string, file: File): Observable<Container> {
    const form = new FormData();
    form.append("file", file);

    return this.http.patch<Container>(`${this.apiUrl}/container/${containerId}/image`, form, {
      headers: this.authHeaders(),
    });
  }

  delete(id: string): Observable<{ success: boolean } | Container> {
    return this.http.delete<{ success: boolean } | Container>(`${this.apiUrl}/container/${id}`, {
      headers: this.authHeaders(),
    });
  }
}
