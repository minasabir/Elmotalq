import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Candidate, CreateCandidateRequest, UpdateCandidateRequest } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/AdminElmtalq/Candidates`)
      .pipe(catchError(this.handleError));
  }

  getUnassignedCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.apiUrl}/AdminElmtalq/Candidates/Unassigned`)
      .pipe(catchError(this.handleError));
  }

  getCandidate(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`)
      .pipe(catchError(this.handleError));
  }

  createCandidate(candidate: CreateCandidateRequest): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.apiUrl}/AdminElmtalq/Candidates`, candidate)
      .pipe(catchError(this.handleError));
  }

  updateCandidate(id: string, candidate: UpdateCandidateRequest): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`, candidate)
      .pipe(catchError(this.handleError));
  }

  patchCandidate(id: string, candidate: Partial<UpdateCandidateRequest>): Observable<Candidate> {
    return this.http.patch<Candidate>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`, candidate)
      .pipe(catchError(this.handleError));
  }

  deleteCandidate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}`)
      .pipe(catchError(this.handleError));
  }

  assignCandidate(id: string, secretaryId: string): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/AdminElmtalq/Candidates/${id}/Assign/${secretaryId}`, {})
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
