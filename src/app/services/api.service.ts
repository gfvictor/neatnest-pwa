import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getData(endpoint: string): Observable<any> {
        return this.http.get<string>(`${this.apiUrl}/${endpoint}`);
    }

    postData(endpoint: string, data: any): Observable<any> {
        return this.http.post<string>(`${this.apiUrl}/${endpoint}`, data);
    }
}
