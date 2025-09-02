import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import type {Obj} from './types';

@Injectable({
    providedIn: 'root'
})
export class ObjectApiService {
    private readonly apiUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {}

    private authHeaders(): HttpHeaders {
        const token: string = localStorage.getItem('token') ?? '';

        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    listByContainer(containerId: string): Observable<Obj[]> {
        return this.http.get<Obj[]>(
            `${this.apiUrl}/object/container/${containerId}`,
            { headers: this.authHeaders() }
        );
    }

    getById(id: string): Observable<Obj> {
        return this.http.get<Obj>(
            `${this.apiUrl}/object/${id}`,
            { headers: this.authHeaders() }
        );
    }

    create(containerId: string, name: string, quantity: number, category?: string): Observable<Obj> {
        const payload: { containerId: string, name: string, quantity: number, category?: string } = {
            containerId,
            name,
            quantity
        };
        if (category) payload.category = category;

        return this.http.post<Obj>(
            `${this.apiUrl}/object`, payload,
            { headers: this.authHeaders() }
        );
    }

    update(id: string, data: Partial<Pick<Obj, 'name' | 'quantity' | 'category'>>): Observable<Obj> {
        return this.http.patch<Obj>(
            `${this.apiUrl}/object/${id}`, data,
            { headers: this.authHeaders() }
        );
    }

    uploadImage(objectId: string, file: File): Observable<Obj> {
        const form = new FormData();
        form.append('file', file);

        return this.http.patch<Obj>(
            `${this.apiUrl}/object/${objectId}/image`, form,
            { headers: this.authHeaders() }
        );
    }

    delete(id: string): Observable<{ success: boolean } | Obj> {
        return this.http.delete<Obj>(
            `${this.apiUrl}/object/${id}`,
            { headers: this.authHeaders() }
        );
    }
}
