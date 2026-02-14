import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: string[];
  timestamp?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  message: string;
}

export interface TestResponse {
  message: string;
  timestamp: string;
  endpoints: string[];
}

export interface CandidateCreateDto {
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  experience: string;
  education: string;
  skills: string;
  resume?: File;
}

export interface CompanyCreateDto {
  name: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  size: string;
  website?: string;
  description?: string;
  logo?: File;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  workingHours: string;
}

export interface AboutInfo {
  companyName: string;
  description: string;
  founded: string;
  employees: string;
  services: string[];
  mission: string;
  vision: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  employee: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface EmployeeCreateDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CandidateAdminResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  jobTitle: string;
  experience: string;
  status: string;
  assignedEmployeeId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAdminResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  industry: string;
  size: string;
  website?: string;
  status: string;
  assignedEmployeeId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.production ? 'https://your-api-domain.com/api' : 'http://localhost:5000/api';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  // Helper method for error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'Connection error. Please check your network.';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Bad request. Please check your input.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized. Please login again.';
    } else if (error.status === 403) {
      errorMessage = 'Access denied. You don\'t have permission.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else {
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    
    console.error('API Error:', error);
    return throwError(() => errorMessage);
  }

  // Helper method for file uploads
  private createFormData(data: any): FormData {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
      if (data[key] instanceof File) {
        formData.append(key, data[key], data[key].name);
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item: any, index: number) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    
    return formData;
  }

  // Helper method for query parameters
  private createParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return httpParams;
  }

  // PUBLIC ENDPOINTS

  // Health Check
  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/Elmtalq/Health`)
      .pipe(catchError(this.handleError));
  }

  // Test Endpoint
  getTest(): Observable<TestResponse> {
    return this.http.get<TestResponse>(`${this.apiUrl}/Elmtalq/Test`)
      .pipe(catchError(this.handleError));
  }

  // Create Candidate (with file upload)
  createCandidate(candidate: CandidateCreateDto): Observable<ApiResponse<any>> {
    const formData = this.createFormData(candidate);
    const options = {}; // Remove content-type header for file uploads
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Elmtalq/Candidates`, formData, options)
      .pipe(
        tap(response => console.log('Candidate created:', response)),
        catchError(this.handleError)
      );
  }

  // Create Company (with file upload)
  createCompany(company: CompanyCreateDto): Observable<ApiResponse<any>> {
    const formData = this.createFormData(company);
    const options = {}; // Remove content-type header for file uploads
    
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/Elmtalq/Companies`, formData, options)
      .pipe(
        tap(response => console.log('Company created:', response)),
        catchError(this.handleError)
      );
  }

  // Get About Information
  getAbout(): Observable<ApiResponse<AboutInfo>> {
    return this.http.get<ApiResponse<AboutInfo>>(`${this.apiUrl}/Elmtalq/About`)
      .pipe(catchError(this.handleError));
  }

  // Get Contact Information
  getContact(): Observable<ApiResponse<ContactInfo>> {
    return this.http.get<ApiResponse<ContactInfo>>(`${this.apiUrl}/Elmtalq/Contact`)
      .pipe(catchError(this.handleError));
  }

  // ADMIN ENDPOINTS

  // Admin Health Check
  getAdminHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/AdminElmtalq/Health`)
      .pipe(catchError(this.handleError));
  }

  // Login
  login(credentials: LoginRequestDto): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.apiUrl}/AdminElmtalq/Auth/Login`, credentials, this.httpOptions)
      .pipe(
        tap(response => {
          if (response.data?.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_info', JSON.stringify(response.data.employee));
          }
        }),
        catchError(this.handleError)
      );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Get user info
  getUserInfo(): any {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Create HTTP headers with auth
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return token ? 
      new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }) : 
      this.httpOptions;
  }

  // Get all candidates (admin)
  getAllCandidates(): Observable<ApiResponse<CandidateAdminResponse[]>> {
    return this.http.get<ApiResponse<CandidateAdminResponse[]>>(
      `${this.apiUrl}/AdminElmtalq/Candidates`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get candidate by ID (admin)
  getCandidateById(id: number): Observable<ApiResponse<CandidateAdminResponse>> {
    return this.http.get<ApiResponse<CandidateAdminResponse>>(
      `${this.apiUrl}/AdminElmtalq/Candidates/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Update candidate
  updateCandidate(id: number, candidate: any): Observable<ApiResponse<CandidateAdminResponse>> {
    return this.http.put<ApiResponse<CandidateAdminResponse>>(
      `${this.apiUrl}/AdminElmtalq/Candidates/${id}`,
      candidate,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Patch candidate
  patchCandidate(id: number, candidate: any): Observable<ApiResponse<CandidateAdminResponse>> {
    return this.http.patch<ApiResponse<CandidateAdminResponse>>(
      `${this.apiUrl}/AdminElmtalq/Candidates/${id}`,
      candidate,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Delete candidate
  deleteCandidate(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/AdminElmtalq/Candidates/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Assign candidate to employee
  assignCandidateToEmployee(candidateId: number, employeeId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/AdminElmtalq/Candidates/${candidateId}/Assign/${employeeId}`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get all companies (admin)
  getAllCompanies(): Observable<ApiResponse<CompanyAdminResponse[]>> {
    return this.http.get<ApiResponse<CompanyAdminResponse[]>>(
      `${this.apiUrl}/AdminElmtalq/Companies`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get company by ID (admin)
  getCompanyById(id: number): Observable<ApiResponse<CompanyAdminResponse>> {
    return this.http.get<ApiResponse<CompanyAdminResponse>>(
      `${this.apiUrl}/AdminElmtalq/Companies/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Update company
  updateCompany(id: number, company: any): Observable<ApiResponse<CompanyAdminResponse>> {
    return this.http.put<ApiResponse<CompanyAdminResponse>>(
      `${this.apiUrl}/AdminElmtalq/Companies/${id}`,
      company,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Patch company
  patchCompany(id: number, company: any): Observable<ApiResponse<CompanyAdminResponse>> {
    return this.http.patch<ApiResponse<CompanyAdminResponse>>(
      `${this.apiUrl}/AdminElmtalq/Companies/${id}`,
      company,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Delete company
  deleteCompany(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/AdminElmtalq/Companies/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Assign company to employee
  assignCompanyToEmployee(companyId: number, employeeId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.apiUrl}/AdminElmtalq/Companies/${companyId}/Assign/${employeeId}`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get all employees (admin)
  getAllEmployees(): Observable<ApiResponse<EmployeeResponse[]>> {
    return this.http.get<ApiResponse<EmployeeResponse[]>>(
      `${this.apiUrl}/AdminElmtalq/Employees`,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Create employee
  createEmployee(employee: EmployeeCreateDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/AdminElmtalq/Employees`,
      employee,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Update employee
  updateEmployee(id: number, employee: any): Observable<ApiResponse<EmployeeResponse>> {
    return this.http.patch<ApiResponse<EmployeeResponse>>(
      `${this.apiUrl}/AdminElmtalq/Employees/${id}`,
      employee,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Search candidates and companies
  search(candidateSearch?: any, companySearch?: any): Observable<ApiResponse<{ Candidates: CandidateAdminResponse[], Companies: CompanyAdminResponse[] }>> {
    const params = this.createParams({ candidateSearch, companySearch });
    return this.http.get<ApiResponse<{ Candidates: CandidateAdminResponse[], Companies: CompanyAdminResponse[] }>>(
      `${this.apiUrl}/AdminElmtalq/Search`,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    ).pipe(catchError(this.handleError));
  }

  // Update about information
  updateAbout(aboutData: any): Observable<ApiResponse<AboutInfo>> {
    return this.http.patch<ApiResponse<AboutInfo>>(
      `${this.apiUrl}/AdminElmtalq/About`,
      aboutData,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Update contact information
  updateContact(contactData: any): Observable<ApiResponse<ContactInfo>> {
    return this.http.patch<ApiResponse<ContactInfo>>(
      `${this.apiUrl}/AdminElmtalq/Contact`,
      contactData,
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }
}
