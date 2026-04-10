import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidate } from '../models/candidate.model';
import { Company } from '../models/company.model';

export interface SearchResponse {
    candidates: Candidate[];
    companies: Company[];
}

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private adminUrl = `${environment.apiUrl}/AdminElmtalq`;
    private publicUrl = `${environment.apiUrl}/Elmtalq`;

    constructor(private http: HttpClient) { }

    search(query: string): Observable<SearchResponse> {
        let params = new HttpParams()
            .set('candidateName', query)
            .set('companyName', query);

        return this.http.get<SearchResponse>(`${this.adminUrl}/Search`, { params })
            .pipe(catchError(this.handleError));
    }

    getAbout(): Observable<any> {
        return this.http.get(`${this.publicUrl}/About`)
            .pipe(catchError(this.handleError));
    }

    getContact(): Observable<any> {
        return this.http.get(`${this.publicUrl}/Contact`)
            .pipe(catchError(this.handleError));
    }

    updateAbout(data: any): Observable<any> {
        return this.http.patch(`${this.adminUrl}/About`, data)
            .pipe(catchError(this.handleError));
    }

    updateContact(data: any): Observable<any> {
        return this.http.patch(`${this.adminUrl}/Contact`, data)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('API Error:', error);
        return throwError(() => error.error?.message || 'Server error');
    }
}
