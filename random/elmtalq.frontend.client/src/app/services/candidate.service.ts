import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from './api.service';

export interface CandidateApplication {
    fullName: string;
    phoneNumber: string;
    jobTitle: string;
    gender: number;
    educationalQualification?: number;
    yearsOfExperience?: number;
    graduationYear?: number;
    country?: string;
    governorate?: string;
    cvFile?: File;
    personalPhotoFile?: File;
    introductionVideoFile?: File;
}

@Injectable({
    providedIn: 'root'
})
export class CandidateService {
    private apiUrl = `${environment.apiUrl}/Elmtalq/Candidates`;

    constructor(private http: HttpClient) { }

    apply(application: CandidateApplication): Observable<ApiResponse<any>> {
        const formData = new FormData();
        formData.append('FullName', application.fullName);
        formData.append('PhoneNumber', application.phoneNumber);
        formData.append('JobTitle', application.jobTitle);
        formData.append('Gender', (application.gender ?? 0).toString());

        if (application.educationalQualification !== undefined && application.educationalQualification !== null) {
            formData.append('EducationalQualification', application.educationalQualification.toString());
        }
        if (application.yearsOfExperience !== undefined && application.yearsOfExperience !== null) {
            formData.append('YearsOfExperience', application.yearsOfExperience.toString());
        }
        if (application.graduationYear !== undefined && application.graduationYear !== null) {
            formData.append('GraduationYear', application.graduationYear.toString());
        }
        if (application.country) {
            formData.append('Country', application.country);
        }
        if (application.governorate) {
            formData.append('Governorate', application.governorate);
        }
        if (application.cvFile) {
            formData.append('CVFile', application.cvFile, application.cvFile.name);
        }
        if (application.personalPhotoFile) {
            formData.append('PersonalPhotoFile', application.personalPhotoFile, application.personalPhotoFile.name);
        }
        if (application.introductionVideoFile) {
            formData.append('IntroductionVideoFile', application.introductionVideoFile, application.introductionVideoFile.name);
        }

        return this.http.post<ApiResponse<any>>(this.apiUrl, formData);
    }
}
