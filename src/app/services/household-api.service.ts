import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import type {Household, HouseholdRelations} from './types';

@Injectable({
    providedIn: 'root'
})
export class HouseholdApiService {
    private readonly apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    private authHeaders(): HttpHeaders {
        const token: string = localStorage.getItem('token') ?? '';

        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getCurrent(): Observable<HouseholdRelations> {
        return this.http.get<HouseholdRelations>(
            `${this.apiUrl}/household`,
            { headers: this.authHeaders() }
        );
    }

    update(data: Partial<Household>): Observable<Household> {
        return this.http.patch<Household>(
            `${this.apiUrl}/household`, data,
            { headers: this.authHeaders() }
        );
    }

    delete(): Observable<{ success: boolean } | Household> {
        return this.http.delete<{ success: boolean } | Household>(
            `${this.apiUrl}/household`,
            { headers: this.authHeaders() }
        );
    }
}
