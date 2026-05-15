import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "@neatnest/environments";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UserApiService {
    private apiUrl = `${environment.apiUrl}/user`;

    constructor(private http: HttpClient) {}

    createProfile(name: string, token: string): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });

        return this.http.post(this.apiUrl, { name }, { headers });
    }
}
