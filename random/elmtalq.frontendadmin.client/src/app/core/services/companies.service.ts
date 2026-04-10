import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../models/company.model';

import { PagedResult, PagedResultDto } from '../../shared/models/pagination.model';
import { HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCompanies(page: number = 1, pageSize: number = 10): Observable<PagedResult<Company>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<ApiResponse<PagedResultDto<Company>>>(`${this.apiUrl}/AdminElmtalq/Companies`, { params })
      .pipe(
        map(response => {
          const dto = response.data as PagedResultDto<Company> | null;
          return {
            items: dto?.Items ?? [],
            totalCount: dto?.TotalCount ?? 0,
            pageNumber: dto?.PageNumber ?? page,
            pageSize: dto?.PageSize ?? pageSize,
            totalPages: dto?.TotalPages ?? 0,
            hasPreviousPage: dto?.HasPreviousPage ?? false,
            hasNextPage: dto?.HasNextPage ?? false
          } as PagedResult<Company>;
        }),
        catchError(this.handleError)
      );
  }

  getUnassignedCompanies(): Observable<Company[]> {
    return this.http
      .get<ApiResponse<Company[]>>(`${this.apiUrl}/AdminElmtalq/Companies/Unassigned`)
      .pipe(
        map(response => response.data ?? []),
        catchError(this.handleError)
      );
  }

  getCompany(id: string): Observable<Company> {
    return this.http
      .get<ApiResponse<Company>>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`)
      .pipe(
        map(response => response.data as Company),
        catchError(this.handleError)
      );
  }

  createCompany(company: CreateCompanyRequest): Observable<Company> {
    return this.http
      .post<ApiResponse<Company>>(`${this.apiUrl}/AdminElmtalq/Companies`, company)
      .pipe(
        map(response => response.data as Company),
        catchError(this.handleError)
      );
  }

  updateCompany(id: string, company: UpdateCompanyRequest): Observable<Company> {
    return this.http
      .put<ApiResponse<Company>>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`, company)
      .pipe(
        map(response => response.data as Company),
        catchError(this.handleError)
      );
  }

  patchCompany(id: string, company: Partial<UpdateCompanyRequest>): Observable<Company> {
    return this.http
      .patch<ApiResponse<Company>>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`, company)
      .pipe(
        map(response => response.data as Company),
        catchError(this.handleError)
      );
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AdminElmtalq/Companies/${id}`)
      .pipe(catchError(this.handleError));
  }

  assignCompany(id: string, secretaryId: string): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/AdminElmtalq/Companies/${id}/Assign/${secretaryId}`, {})
      .pipe(
        map(() => void 0),
        catchError(this.handleError)
      );
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
