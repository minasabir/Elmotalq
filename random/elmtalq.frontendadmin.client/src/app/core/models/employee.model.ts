export interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phoneNumber: string;
  role: string | number;
  password: string;
  salary: number;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  role?: string | number;
  isActive?: boolean;
  salary?: number;
}
