export interface Company {
  id: string; // Map to int ID from backend
  companyName: string;
  contactPhone: string;
  email: string;
  country: string;
  city: string;
  requiredJobTitle: string;
  companyIndustry: string;
  assignedEmployeeId?: number;
  assignedEmployeeName?: string;
  createdAt: string;
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
