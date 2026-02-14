export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  yearsOfExperience: number;
  currentJobTitle: string;
  educationalQualification: string;
  cvPath?: string;
  assignedSecretaryId?: string;
  createdAt: string;
  updatedAt: string;
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
