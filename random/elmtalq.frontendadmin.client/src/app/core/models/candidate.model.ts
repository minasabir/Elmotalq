export interface Candidate {
  id: string; // Map to int ID from backend
  fullName: string;
  email: string;
  phoneNumber: string;
  jobTitle: string;
  gender: number;
  educationalQualification?: number;
  yearsOfExperience?: number;
  graduationYear?: number;
  country?: string;
  governorate?: string;
  cvFilePath?: string;
  personalPhotoFilePath?: string;
  introductionVideoFilePath?: string;
  assignedEmployeeId?: number;
  assignedEmployeeName?: string;
  createdAt: string;
}

export interface CreateCandidateRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  yearsOfExperience: number;
  currentJobTitle: string;
  educationalQualification: string;
  cvFile?: File;
}

export interface UpdateCandidateRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  yearsOfExperience?: number;
  currentJobTitle?: string;
  educationalQualification?: string;
  assignedSecretaryId?: string;
}
