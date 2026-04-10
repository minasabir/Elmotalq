import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from './api.service';

export interface CompanyRequest {
    companyName: string;
    contactPhone: string;
    email: string;
    country: string;
    city: string;
    requiredJobTitle: string;
    companyIndustry: string;
}

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    private apiUrl = `${environment.apiUrl}/Elmtalq/Companies`;

    constructor(private http: HttpClient) { }

    request(data: CompanyRequest): Observable<ApiResponse<any>> {
        // Mapping to PascalCase for the backend DTO
        const payload = {
            CompanyName: data.companyName,
            ContactPhone: data.contactPhone,
            Email: data.email,
            Country: data.country,
            City: data.city,
            RequiredJobTitle: data.requiredJobTitle,
            CompanyIndustry: data.companyIndustry
        };
        return this.http.post<ApiResponse<any>>(this.apiUrl, payload);
    }
}
