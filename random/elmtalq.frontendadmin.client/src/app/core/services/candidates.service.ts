import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../models/candidate.model';
import { PagedResult, PagedResultDto } from '../../shared/models/pagination.model';
import { HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCandidates(page: number = 1, pageSize: number = 10): Observable<PagedResult<Candidate>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<ApiResponse<PagedResultDto<Candidate>>>(`${this.apiUrl}/AdminElmtalq/Candidates`, { params })
      .pipe(
        map(response => {
          const dto = response.data as PagedResultDto<Candidate> | null;
          return {
            items: dto?.Items ?? [],
            totalCount: dto?.TotalCount ?? 0,
            pageNumber: dto?.PageNumber ?? page,
            pageSize: dto?.PageSize ?? pageSize,
            totalPages: dto?.TotalPages ?? 0,
            hasPreviousPage: dto?.HasPreviousPage ?? false,
            hasNextPage: dto?.HasNextPage ?? false
          } as PagedResult<Candidate>;
        }),
        catchError(this.handleError)
      );
  }

  getUnassignedCandidates(): Observable<Candidate[]> {
    return this.http
      .get<ApiResponse<Candidate[]>>(`${this.apiUrl}/AdminElmtalq/Candidates/Unassigned`)
      .pipe(
        map(response => response.data ?? []),
        catchError(this.handleError)
      );
  }

  getCandidate(id: string): Observable<Candidate> {
    return this.http
      .get<ApiResponse<Candidate>>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`)
      .pipe(
        map(response => response.data as Candidate),
        catchError(this.handleError)
      );
  }

  createCandidate(candidate: CreateCandidateRequest): Observable<Candidate> {
    return this.http
      .post<ApiResponse<Candidate>>(`${this.apiUrl}/AdminElmtalq/Candidates`, candidate)
      .pipe(
        map(response => response.data as Candidate),
        catchError(this.handleError)
      );
  }

  updateCandidate(id: string, candidate: UpdateCandidateRequest): Observable<Candidate> {
    return this.http
      .put<ApiResponse<Candidate>>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`, candidate)
      .pipe(
        map(response => response.data as Candidate),
        catchError(this.handleError)
      );
  }

  patchCandidate(id: string, candidate: Partial<UpdateCandidateRequest>): Observable<Candidate> {
    return this.http
      .patch<ApiResponse<Candidate>>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`, candidate)
      .pipe(
        map(response => response.data as Candidate),
        catchError(this.handleError)
      );
  }

  deleteCandidate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`)
      .pipe(catchError(this.handleError));
  }

  assignCandidate(id: string, secretaryId: string): Observable<void> {
    return this.http
      .put<ApiResponse<object>>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}/Assign/${secretaryId}`, {})
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
