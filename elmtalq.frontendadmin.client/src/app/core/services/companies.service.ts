import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/AdminElmtalq/Companies`)
      .pipe(catchError(this.handleError));
  }

  getUnassignedCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/AdminElmtalq/Companies/Unassigned`)
      .pipe(catchError(this.handleError));
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`)
      .pipe(catchError(this.handleError));
  }

  createCompany(company: CreateCompanyRequest): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/AdminElmtalq/Companies`, company)
      .pipe(catchError(this.handleError));
  }

  updateCompany(id: string, company: UpdateCompanyRequest): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`, company)
      .pipe(catchError(this.handleError));
  }

  patchCompany(id: string, company: Partial<UpdateCompanyRequest>): Observable<Company> {
    return this.http.patch<Company>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`, company)
      .pipe(catchError(this.handleError));
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`)
      .pipe(catchError(this.handleError));
  }

  assignCompany(id: string, secretaryId: string): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/AdminElmtalq/Companies/${id}/Assign/${secretaryId}`, {})
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    return throwError(() => errorMessage);
  }
}
