export interface Company {
  id: string;
  companyName: string;
  industrySector: string;
  contactPerson: string;
  companyEmail: string;
  phoneNumber: string;
  estimatedHiringNeeds: string;
  jobTitleDescription: string;
  documentPath?: string;
  assignedSecretaryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  industrySector: string;
  contactPerson: string;
  companyEmail: string;
  phoneNumber: string;
  estimatedHiringNeeds: string;
  jobTitleDescription: string;
  documentFile?: File;
}

export interface UpdateCompanyRequest {
  companyName?: string;
  industrySector?: string;
  contactPerson?: string;
  companyEmail?: string;
  phoneNumber?: string;
  estimatedHiringNeeds?: string;
  jobTitleDescription?: string;
  assignedSecretaryId?: string;
}
