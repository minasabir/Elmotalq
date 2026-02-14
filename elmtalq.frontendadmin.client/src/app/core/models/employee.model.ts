export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  password: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isActive?: boolean;
}
