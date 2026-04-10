import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from './api.service';

export interface AboutData {
    companyDescription: string;
    officeLocation: string;
}

export interface ContactData {
    facebook: string;
    instagram: string;
    whatsApp: string;
    linkedIn: string;
    email: string;
    phone: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContentService {
    private apiUrl = `${environment.apiUrl}/Elmtalq`;

    constructor(private http: HttpClient) { }

    getAbout(): Observable<AboutData> {
        return this.http
            .get<ApiResponse<AboutData>>(`${this.apiUrl}/About`)
            .pipe(map(response => response.data as AboutData));
    }

    getContact(): Observable<ContactData> {
        return this.http
            .get<ApiResponse<ContactData>>(`${this.apiUrl}/Contact`)
            .pipe(map(response => response.data as ContactData));
    }
}
