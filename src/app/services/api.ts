// API Configuration and Service Layer
// Base URL: https://elmotalq.runasp.net

const API_BASE_URL = 'https://elmotalq.runasp.net';

// Types based on API documentation
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
}

export interface Candidate extends BaseEntity {
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  gender: Gender;
  educationalQualification?: EducationalQualification;
  yearsOfExperience?: number;
  graduationYear?: number;
  country?: string;
  governorate?: string;
  cvFilePath?: string;
  personalPhotoFilePath?: string;
  introductionVideoFilePath?: string;
  assignedEmployeeId?: number;
  assignedEmployee?: Employee;
}

export interface Company extends BaseEntity {
  companyName: string;
  contactPhone: string;
  email: string;
  country: string;
  city: string;
  requiredJobTitle: string;
  companyIndustry: string;
  assignedEmployeeId?: number;
  assignedEmployee?: Employee;
}

export interface Employee extends BaseEntity {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  salary: number;
  isActive: boolean;
  assignedCandidates?: Candidate[];
  assignedCompanies?: Company[];
}

export interface CompanyInfo extends BaseEntity {
  companyDescription: string;
  officeLocation: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  linkedIn: string;
  contactEmail: string;
  contactPhone: string;
}

// Enums
export enum Gender {
  Male = 0,
  Female = 1
}

export enum UserRole {
  Owner = 0,
  Secretary = 1
}

export enum EducationalQualification {
  HighSchool = 0,
  Diploma = 1,
  Bachelor = 2,
  Master = 3,
  PhD = 4,
  Other = 5
}

// Request/Response DTOs
export interface CreateCandidateRequest {
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  gender: Gender;
  educationalQualification?: EducationalQualification;
  yearsOfExperience?: number;
  graduationYear?: number;
  country?: string;
  governorate?: string;
  cvFile?: File;
  personalPhotoFile?: File;
  introductionVideoFile?: File;
}

export interface CreateCompanyRequest {
  companyName: string;
  contactPhone: string;
  email: string;
  country: string;
  city: string;
  requiredJobTitle: string;
  companyIndustry: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  salary: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CandidateSearchRequest {
  candidateName?: string;
  jobTitle?: string;
  yearsOfExperience?: number;
  educationalQualification?: EducationalQualification;
  country?: string;
  graduationYear?: number;
  assignedEmployeeId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface CompanySearchRequest {
  companyName?: string;
  requiredJobTitle?: string;
  country?: string;
  assignedEmployeeId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface SearchResponse {
  candidates: PagedResult<Candidate>;
  companies: PagedResult<Company>;
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.log('API Request:', { url, method: options.method, headers, body: options.body });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log('API Response:', { status: response.status, statusText: response.statusText });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error Body:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (e.g., 204 NoContent)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, message: 'Success', data: null as T };
    }

    const jsonData = await response.json();
    console.log('API Response Data:', jsonData);

    // If response is already in ApiResponse format, return it
    if (jsonData && typeof jsonData.success === 'boolean') {
      return jsonData as ApiResponse<T>;
    }

    // Otherwise, wrap the raw data in ApiResponse format
    return {
      success: true,
      message: 'Success',
      data: jsonData as T
    };
  }

  private async requestWithFormData<T>(
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (e.g., 204 NoContent)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, message: 'Success', data: null as T };
    }

    const jsonData = await response.json();

    // If response is already in ApiResponse format, return it
    if (jsonData && typeof jsonData.success === 'boolean') {
      return jsonData as ApiResponse<T>;
    }

    // Otherwise, wrap the raw data in ApiResponse format
    return {
      success: true,
      message: 'Success',
      data: jsonData as T
    };
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Public API Endpoints
  async healthCheck() {
    return this.request('/api/Elmtalq/Health');
  }

  async testEndpoint() {
    return this.request('/api/Elmtalq/Test');
  }

  async createCandidate(data: CreateCandidateRequest) {
    const formData = new FormData();
    
    // Add all fields to FormData
    formData.append('FullName', data.fullName);
    formData.append('PhoneNumber', data.phoneNumber);
    formData.append('JobTitle', data.jobTitle);
    formData.append('Gender', data.gender.toString());
    
    if (data.educationalQualification !== undefined) {
      formData.append('EducationalQualification', data.educationalQualification.toString());
    }
    if (data.yearsOfExperience !== undefined) {
      formData.append('YearsOfExperience', data.yearsOfExperience.toString());
    }
    if (data.graduationYear !== undefined) {
      formData.append('GraduationYear', data.graduationYear.toString());
    }
    if (data.country) {
      formData.append('Country', data.country);
    }
    if (data.governorate) {
      formData.append('Governorate', data.governorate);
    }
    
    // Add files if present
    if (data.cvFile) {
      formData.append('CVFile', data.cvFile);
    }
    if (data.personalPhotoFile) {
      formData.append('PersonalPhotoFile', data.personalPhotoFile);
    }
    if (data.introductionVideoFile) {
      formData.append('IntroductionVideoFile', data.introductionVideoFile);
    }

    return this.requestWithFormData('/api/Elmtalq/Candidates', formData);
  }

  async createCompany(data: CreateCompanyRequest) {
    return this.request<Company>('/api/Elmtalq/Companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAboutInfo() {
    return this.request<CompanyInfo>('/api/Elmtalq/About');
  }

  async getContactInfo() {
    return this.request<CompanyInfo>('/api/Elmtalq/Contact');
  }

  // Admin API Endpoints
  async adminHealthCheck() {
    return this.request('/api/AdminElmtalq/Health');
  }

  async login(data: LoginRequest) {
    const response = await this.request<LoginResponse>('/api/AdminElmtalq/Auth/Login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async createEmployee(data: CreateEmployeeRequest) {
    return this.request<Employee>('/api/AdminElmtalq/Employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: number, data: Partial<CreateEmployeeRequest>) {
    return this.request<Employee>(`/api/AdminElmtalq/Employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getAllEmployees() {
    return this.request<Employee[]>('/api/AdminElmtalq/Employees');
  }

  async getAllCandidates(page: number = 1, pageSize: number = 10) {
    return this.request<PagedResult<Candidate>>(
      `/api/AdminElmtalq/Candidates?page=${page}&pageSize=${pageSize}`
    );
  }

  async getUnassignedCandidates() {
    return this.request<Candidate[]>('/api/AdminElmtalq/Candidates/Unassigned');
  }

  async getCandidateById(id: number) {
    return this.request<Candidate>(`/api/AdminElmtalq/Candidates/${id}`);
  }

  async updateCandidate(id: number, data: Partial<CreateCandidateRequest>) {
    return this.request<Candidate>(`/api/AdminElmtalq/Candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patchCandidate(id: number, data: Partial<CreateCandidateRequest>) {
    return this.request<Candidate>(`/api/AdminElmtalq/Candidates/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCandidate(id: number) {
    return this.request(`/api/AdminElmtalq/Candidates/${id}`, {
      method: 'DELETE',
    });
  }

  async assignCandidateToEmployee(candidateId: number, secretaryId: number) {
    return this.request(`/api/AdminElmtalq/Candidates/${candidateId}/Assign/${secretaryId}`, {
      method: 'PUT',
    });
  }

  async getAllCompanies(page: number = 1, pageSize: number = 10) {
    return this.request<PagedResult<Company>>(
      `/api/AdminElmtalq/Companies?page=${page}&pageSize=${pageSize}`
    );
  }

  async getUnassignedCompanies() {
    return this.request<Company[]>('/api/AdminElmtalq/Companies/Unassigned');
  }

  async getCompanyById(id: number) {
    return this.request<Company>(`/api/AdminElmtalq/Companies/${id}`);
  }

  async updateCompany(id: number, data: Partial<CreateCompanyRequest>) {
    return this.request<Company>(`/api/AdminElmtalq/Companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patchCompany(id: number, data: Partial<CreateCompanyRequest>) {
    return this.request<Company>(`/api/AdminElmtalq/Companies/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCompany(id: number) {
    return this.request(`/api/AdminElmtalq/Companies/${id}`, {
      method: 'DELETE',
    });
  }

  async assignCompanyToEmployee(companyId: number, secretaryId: number) {
    return this.request(`/api/AdminElmtalq/Companies/${companyId}/Assign/${secretaryId}`, {
      method: 'PUT',
    });
  }

  async search(candidateSearch?: CandidateSearchRequest, companySearch?: CompanySearchRequest) {
    const params = new URLSearchParams();
    
    if (candidateSearch) {
      Object.entries(candidateSearch).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(`candidateSearch.${key}`, value.toString());
        }
      });
    }
    
    if (companySearch) {
      Object.entries(companySearch).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(`companySearch.${key}`, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/api/AdminElmtalq/Search?${queryString}` : '/api/AdminElmtalq/Search';
    
    return this.request<SearchResponse>(endpoint);
  }

  async updateAboutInfo(data: Partial<CompanyInfo>) {
    return this.request<CompanyInfo>('/api/AdminElmtalq/About', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateContactInfo(data: Partial<CompanyInfo>) {
    return this.request<CompanyInfo>('/api/AdminElmtalq/Contact', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Helper functions for enum display
export const getGenderDisplay = (gender: Gender): string => {
  return gender === Gender.Male ? 'Male' : 'Female';
};

export const getRoleDisplay = (role: UserRole): string => {
  return role === UserRole.Owner ? 'Owner' : 'Secretary';
};

export const getEducationDisplay = (education: EducationalQualification): string => {
  const educationMap = {
    [EducationalQualification.HighSchool]: 'High School',
    [EducationalQualification.Diploma]: 'Diploma',
    [EducationalQualification.Bachelor]: 'Bachelor',
    [EducationalQualification.Master]: 'Master',
    [EducationalQualification.PhD]: 'PhD',
    [EducationalQualification.Other]: 'Other',
  };
  return educationMap[education] || 'Unknown';
};
