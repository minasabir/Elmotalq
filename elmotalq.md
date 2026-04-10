# Elmotalq System Documentation

## 1. Overview

Elmtalq is a recruitment management system that connects job candidates with companies seeking employees. The system allows:

- **Job Candidates** to submit their profiles with CVs, photos, and introduction videos
- **Companies** to post job requirements and contact information  
- **Administrators** (Employees) to manage candidates, companies, and assignments

The system has two main interfaces:
- **Public API** for candidates and companies to submit information
- **Admin Dashboard** for employees to manage the recruitment process

---

## 2. Entities (Database Models)

### Entity: BaseEntity

**Description:**
Base class that provides common fields for all entities in the system.

**Fields:**
| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| Id | int | Yes | Unique identifier for the record | 1 |
| CreatedAt | DateTime | Yes | When the record was created (auto-set) | 2024-01-15T10:30:00Z |
| UpdatedAt | DateTime | Yes | When the record was last updated (auto-set) | 2024-01-16T14:22:00Z |
| IsDeleted | bool | Yes | Soft delete flag (false by default) | false |
| DeletedAt | DateTime? | No | When the record was soft deleted (if applicable) | null |

---

### Entity: Employee

**Description:**
Administrative users who manage the recruitment system. Can be Owners (full access) or Secretaries (limited access).

**Fields:**
| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| Id | int | Yes | Unique identifier | 1 |
| Name | string | Yes | Employee's full name | "John Smith" |
| Email | string | Yes | Employee's email (must be unique) | "john@company.com" |
| PasswordHash | string | Yes | Encrypted password (not visible in UI) | "hashed_password" |
| Role | UserRole | Yes | Employee role (Owner=0, Secretary=1) | 1 |
| Salary | decimal | Yes | Employee salary | 5000.00 |
| IsActive | bool | Yes | Whether employee account is active | true |
| CreatedAt | DateTime | Yes | When employee was created | 2024-01-15T10:30:00Z |
| UpdatedAt | DateTime | Yes | When employee was last updated | 2024-01-16T14:22:00Z |
| IsDeleted | bool | Yes | Soft delete flag | false |
| DeletedAt | DateTime? | No | When employee was deleted | null |

**Navigation Properties:**
- **AssignedCandidates**: List of candidates assigned to this employee
- **AssignedCompanies**: List of companies assigned to this employee

---

### Entity: Candidate

**Description:**
Job seekers who submit their profiles for consideration by companies.

**Fields:**
| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| Id | int | Yes | Unique identifier | 1 |
| FullName | string | Yes | Candidate's full name | "Ahmed Mohamed" |
| PhoneNumber | string | Yes | Candidate's phone number | "+201234567890" |
| JobTitle | string | Yes | Desired job title | "Software Developer" |
| Gender | Gender | Yes | Gender (Male=0, Female=1) | 0 |
| EducationalQualification | EducationalQualification? | No | Education level (HighSchool=0, Diploma=1, Bachelor=2, Master=3, PhD=4, Other=5) | 2 |
| YearsOfExperience | int? | No | Number of years of experience | 5 |
| GraduationYear | int? | No | Year of graduation | 2020 |
| Country | string? | No | Candidate's country | "Egypt" |
| Governorate | string? | No | Candidate's governorate/state | "Cairo" |
| CVFilePath | string? | No | Path to uploaded CV file | "/uploads/cvs/candidate1_cv.pdf" |
| PersonalPhotoFilePath | string? | No | Path to uploaded photo | "/uploads/photos/candidate1_photo.jpg" |
| IntroductionVideoFilePath | string? | No | Path to uploaded video | "/uploads/videos/candidate1_video.mp4" |
| AssignedEmployeeId | int? | No | ID of employee assigned to this candidate | 3 |
| AssignedEmployee | Employee? | No | Employee assigned to this candidate | Employee object |
| CreatedAt | DateTime | Yes | When candidate was created | 2024-01-15T10:30:00Z |
| UpdatedAt | DateTime | Yes | When candidate was last updated | 2024-01-16T14:22:00Z |
| IsDeleted | bool | Yes | Soft delete flag | false |
| DeletedAt | DateTime? | No | When candidate was deleted | null |

---

### Entity: Company

**Description:**
Companies looking to hire candidates and posting job requirements.

**Fields:**
| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| Id | int | Yes | Unique identifier | 1 |
| CompanyName | string | Yes | Company name | "Tech Solutions Inc" |
| ContactPhone | string | Yes | Company contact phone | "+201122233344" |
| Email | string | Yes | Company email | "hr@techsolutions.com" |
| Country | string | Yes | Company country | "Egypt" |
| City | string | Yes | Company city | "Cairo" |
| RequiredJobTitle | string | Yes | Job position they want to fill | "Senior Developer" |
| CompanyIndustry | string | Yes | Industry type | "Technology" |
| AssignedEmployeeId | int? | No | ID of employee assigned to this company | 2 |
| AssignedEmployee | Employee? | No | Employee assigned to this company | Employee object |
| CreatedAt | DateTime | Yes | When company was created | 2024-01-15T10:30:00Z |
| UpdatedAt | DateTime | Yes | When company was last updated | 2024-01-16T14:22:00Z |
| IsDeleted | bool | Yes | Soft delete flag | false |
| DeletedAt | DateTime? | No | When company was deleted | null |

---

### Entity: CompanyInfo

**Description:**
General company information displayed on the public website (About and Contact pages).

**Fields:**
| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| Id | int | Yes | Unique identifier | 1 |
| CompanyDescription | string | Yes | Company description for About page | "We are a leading technology company..." |
| OfficeLocation | string | Yes | Office location (Google Maps link or coordinates) | "https://maps.google.com/?q=30.0444,31.2357" |
| Facebook | string | Yes | Facebook profile URL | "https://facebook.com/company" |
| Instagram | string | Yes | Instagram profile URL | "https://instagram.com/company" |
| WhatsApp | string | Yes | WhatsApp number | "+201122233344" |
| LinkedIn | string | Yes | LinkedIn profile URL | "https://linkedin.com/company" |
| ContactEmail | string | Yes | Contact email for public inquiries | "info@company.com" |
| ContactPhone | string | Yes | Contact phone for public inquiries | "+201122233344" |
| CreatedAt | DateTime | Yes | When info was created | 2024-01-15T10:30:00Z |
| UpdatedAt | DateTime | Yes | When info was last updated | 2024-01-16T14:22:00Z |
| IsDeleted | bool | Yes | Soft delete flag | false |
| DeletedAt | DateTime? | No | When info was deleted | null |

---

## 3. Public API (User Side)

### Endpoint: Health Check

- **Method:** GET
- **URL:** /api/Elmtalq/Health
- **Description:** Checks if the API is running properly

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true for healthy status | true |
| Message | string | Status message | "Elmtalq Recruitment API is running successfully" |
| Data | object | Health information | {status: "Healthy", timestamp: "...", version: "v1.0.0"} |

#### Notes for UI:
- Used for monitoring API status
- Not visible to end users

---

### Endpoint: Test Endpoint

- **Method:** GET
- **URL:** /api/Elmtalq/Test
- **Description:** Lists all available public endpoints

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true | true |
| Message | string | Status message | "API is working correctly!" |
| Data | object | List of available endpoints | Array of endpoint URLs |

#### Notes for UI:
- Used for development/testing
- Not visible to end users

---

### Endpoint: Create Candidate

- **Method:** POST
- **URL:** /api/Elmtalq/Candidates
- **Description:** Submits a new candidate profile with optional file uploads

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| FullName | string | Yes | Candidate's full name | "Ahmed Mohamed" |
| PhoneNumber | string | Yes | Phone number | "+201234567890" |
| JobTitle | string | Yes | Desired job title | "Software Developer" |
| Gender | int | Yes | Gender (0=Male, 1=Female) | 0 |
| EducationalQualification | int? | No | Education level (0-5) | 2 |
| YearsOfExperience | int? | No | Years of experience | 5 |
| GraduationYear | int? | No | Graduation year | 2020 |
| Country | string? | No | Country | "Egypt" |
| Governorate | string? | No | Governorate/state | "Cairo" |
| CVFile | IFormFile? | No | CV file upload | PDF file |
| PersonalPhotoFile | IFormFile? | No | Photo upload | JPG/PNG file |
| IntroductionVideoFile | IFormFile? | No | Video upload | MP4 file |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether creation was successful | true |
| Message | string | Success message | "Candidate created successfully" |
| Data | CandidateResponseDto | Created candidate data | Candidate object with ID |

#### Notes for UI:
- **Form**: Multi-step form with file upload capabilities
- **Required Fields**: FullName, PhoneNumber, JobTitle, Gender
- **Optional Fields**: Education, experience, location, files
- **File Uploads**: Support for CV (PDF), Photo (JPG/PNG), Video (MP4)
- **Validation**: Phone number format, file size limits, file type restrictions
- **Success**: Show confirmation with candidate ID
- **Error**: Display validation errors for each field

---

### Endpoint: Create Company

- **Method:** POST
- **URL:** /api/Elmtalq/Companies
- **Description:** Submits a new company request for recruitment services

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| CompanyName | string | Yes | Company name | "Tech Solutions Inc" |
| ContactPhone | string | Yes | Contact phone | "+201122233344" |
| Email | string | Yes | Company email | "hr@techsolutions.com" |
| Country | string | Yes | Country | "Egypt" |
| City | string | Yes | City | "Cairo" |
| RequiredJobTitle | string | Yes | Position to fill | "Senior Developer" |
| CompanyIndustry | string | Yes | Industry type | "Technology" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether creation was successful | true |
| Message | string | Success message | "Company request created successfully" |
| Data | CompanyResponseDto | Created company data | Company object with ID |

#### Notes for UI:
- **Form**: Single-page form for company information
- **Required Fields**: All fields are required
- **Validation**: Email format, phone format, character limits
- **Success**: Show confirmation with company request ID
- **Error**: Display field-specific validation errors

---

### Endpoint: Get About Information

- **Method:** GET
- **URL:** /api/Elmtalq/About
- **Description:** Retrieves company information for the About page

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether data was found | true |
| Message | string | Status message | "Company information retrieved successfully" |
| Data | AboutResponseDto | Company about information | {CompanyDescription: "...", OfficeLocation: "..."} |

#### Notes for UI:
- **Page**: Static About page content
- **Content**: Company description and office location
- **Error**: Show "Information not available" if no data exists

---

### Endpoint: Get Contact Information

- **Method:** GET
- **URL:** /api/Elmtalq/Contact
- **Description:** Retrieves contact information for the Contact page

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether data was found | true |
| Message | string | Status message | "Contact information retrieved successfully" |
| Data | ContactResponseDto | Contact information | {Facebook: "...", WhatsApp: "...", Email: "..."} |

#### Notes for UI:
- **Page**: Contact page with social media and contact details
- **Content**: Social media links, WhatsApp, email, phone
- **UI Elements**: Clickable links, phone number formatting
- **Error**: Show "Contact information not available" if no data exists

---

## 4. Admin API (Dashboard / Backoffice)

### Endpoint: Admin Health Check

- **Method:** GET
- **URL:** /api/AdminElmtalq/Health
- **Description:** Checks if admin API is running

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true for healthy status | true |
| Message | string | Status message | "Elmtalq Recruitment Admin API is running successfully" |
| Data | object | Health information | {status: "Healthy", timestamp: "...", version: "v1.0.0"} |

#### Admin UI Behavior:
- Used for monitoring admin panel status
- Not visible in admin interface

---

### Endpoint: Login

- **Method:** POST
- **URL:** /api/AdminElmtalq/Auth/Login
- **Description:** Authenticates employees and returns JWT token

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Email | string | Yes | Employee email | "john@company.com" |
| Password | string | Yes | Employee password | "password123" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether login was successful | true |
| Message | string | Status message | "Login successful" |
| Data | LoginResponseDto | Login result | {Token: "jwt_token", UserId: 1, Name: "John", Email: "...", Role: 1} |

#### Admin UI Behavior:
- **Login Form**: Email and password fields
- **Validation**: Required fields, email format
- **Success**: Store JWT token, redirect to dashboard
- **Error**: Show "Invalid email or password" message
- **Role-based**: Different access levels for Owner vs Secretary

---

### Endpoint: Create Employee

- **Method:** POST
- **URL:** /api/AdminElmtalq/Employees
- **Description:** Creates a new employee account (Owner only)

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Name | string | Yes | Employee name | "Jane Smith" |
| Email | string | Yes | Employee email (must be unique) | "jane@company.com" |
| Password | string | Yes | Initial password | "tempPassword123" |
| Role | int | Yes | Role (0=Owner, 1=Secretary) | 1 |
| Salary | decimal | Yes | Employee salary | 4500.00 |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether creation was successful | true |
| Message | string | Status message | "Employee created successfully" |
| Data | EmployeeResponseDto | Created employee data | Employee object with ID |

#### Admin UI Behavior:
- **Form**: Employee creation form (Owner only)
- **Access**: Only visible to Owner role
- **Validation**: Email uniqueness, required fields
- **Success**: Show confirmation, add to employees list
- **Error**: Field validation errors, email exists message

---

### Endpoint: Update Employee (Patch)

- **Method:** PATCH
- **URL:** /api/AdminElmtalq/Employees/{id}
- **Description:** Partially updates employee information (Owner only)

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| Name | string? | No | Employee name | "Jane Doe" |
| Email | string? | No | Employee email | "jane.doe@company.com" |
| Role | int? | No | Role (0=Owner, 1=Secretary) | 1 |
| Salary | decimal? | No | Salary | 5000.00 |
| IsActive | bool? | No | Account status | true |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Employee updated successfully" |
| Data | EmployeeResponseDto | Updated employee data | Employee object |

#### Admin UI Behavior:
- **Form**: Inline edit or modal form for employee details
- **Access**: Only visible to Owner role
- **Fields**: Partial update - only send changed fields
- **Success**: Refresh employee data in table
- **Error**: Show validation errors, "Employee not found"

---

### Endpoint: Get All Employees

- **Method:** GET
- **URL:** /api/AdminElmtalq/Employees
- **Description:** Retrieves list of all employees (Owner only)

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true if successful | true |
| Message | string | Status message | "Employees retrieved successfully" |
| Data | EmployeeResponseDto[] | Array of employees | Array of employee objects |

#### Admin UI Behavior:
- **Table**: Employees list table
- **Columns**: Name, Email, Role, Salary, IsActive, CreatedAt
- **Actions**: Edit, Deactivate/Activate (Owner only)
- **Access**: Only visible to Owner role
- **Sorting**: By name, email, creation date
- **Filters**: By role, active status

---

### Endpoint: Get All Candidates

- **Method:** GET
- **URL:** /api/AdminElmtalq/Candidates
- **Description:** Retrieves paginated list of candidates

#### Request (Query Parameters):
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| page | int | No | Page number (default: 1) | 1 |
| pageSize | int | No | Items per page (default: 10) | 10 |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true if successful | true |
| Message | string | Status message | "Candidates retrieved successfully" |
| Data | PagedResult<CandidateAdminResponseDto> | Paginated candidates | {Items: [...], TotalCount: 50, PageNumber: 1, PageSize: 10, ...} |

#### Admin UI Behavior:
- **Table**: Candidates list with pagination
- **Columns**: Name, Phone, Job Title, Gender, Education, Experience, Assigned Employee, CreatedAt
- **Pagination**: Page numbers, next/prev buttons, items per page selector
- **Actions**: View Details, Edit, Assign (Owner), Delete (Owner)
- **Sorting**: By name, job title, experience, creation date
- **Filters**: Assigned status, gender, education level, experience range

---

### Endpoint: Get Unassigned Candidates

- **Method:** GET
- **URL:** /api/AdminElmtalq/Candidates/Unassigned
- **Description:** Retrieves candidates not assigned to any employee (Owner only)

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true if successful | true |
| Message | string | Status message | "Unassigned candidates retrieved successfully" |
| Data | CandidateAdminResponseDto[] | Array of unassigned candidates | Array of candidate objects |

#### Admin UI Behavior:
- **Dropdown**: Candidates available for assignment
- **Access**: Only visible to Owner role
- **Use Case**: When assigning candidates to employees
- **Display**: Name, job title, phone for selection

---

### Endpoint: Get Candidate by ID

- **Method:** GET
- **URL:** /api/AdminElmtalq/Candidates/{id}
- **Description:** Retrieves detailed information for a specific candidate

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether candidate was found | true |
| Message | string | Status message | "Candidate retrieved successfully" |
| Data | CandidateAdminResponseDto | Candidate details | Complete candidate object |

#### Admin UI Behavior:
- **Details Page**: Complete candidate profile view
- **Sections**: Personal info, education, experience, files, assignment
- **File Downloads**: Links to CV, photo, video if available
- **Assignment Info**: Show assigned employee or "Unassigned"
- **Actions**: Edit, Assign (Owner), Delete (Owner)
- **Error**: "Candidate not found" message

---

### Endpoint: Update Candidate

- **Method:** PUT
- **URL:** /api/AdminElmtalq/Candidates/{id}
- **Description:** Updates all candidate information

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| FullName | string | Yes | Candidate name | "Updated Name" |
| PhoneNumber | string | Yes | Phone number | "+201234567890" |
| JobTitle | string | Yes | Job title | "Updated Job" |
| Gender | int | Yes | Gender (0=Male, 1=Female) | 0 |
| EducationalQualification | int? | No | Education level | 2 |
| YearsOfExperience | int? | No | Years of experience | 5 |
| GraduationYear | int? | No | Graduation year | 2020 |
| Country | string? | No | Country | "Egypt" |
| Governorate | string? | No | Governorate | "Cairo" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Candidate updated successfully" |
| Data | CandidateAdminResponseDto | Updated candidate data | Candidate object |

#### Admin UI Behavior:
- **Form**: Complete candidate edit form
- **Validation**: All required fields must be provided
- **Success**: Refresh candidate details, show success message
- **Error**: Field validation errors, "Candidate not found"

---

### Endpoint: Patch Candidate

- **Method:** PATCH
- **URL:** /api/AdminElmtalq/Candidates/{id}
- **Description:** Partially updates candidate information

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| FullName | string? | No | Candidate name | "Updated Name" |
| PhoneNumber | string? | No | Phone number | "+201234567890" |
| JobTitle | string? | No | Job title | "Updated Job" |
| Gender | int? | No | Gender (0=Male, 1=Female) | 0 |
| EducationalQualification | int? | No | Education level | 2 |
| YearsOfExperience | int? | No | Years of experience | 5 |
| GraduationYear | int? | No | Graduation year | 2020 |
| Country | string? | No | Country | "Egypt" |
| Governorate | string? | No | Governorate | "Cairo" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Candidate updated successfully" |
| Data | CandidateAdminResponseDto | Updated candidate data | Candidate object |

#### Admin UI Behavior:
- **Inline Edit**: Quick updates without full form
- **Fields**: Update only specific fields that changed
- **Success**: Refresh only updated data
- **Error**: Validation errors, "Candidate not found"

---

### Endpoint: Delete Candidate

- **Method:** DELETE
- **URL:** /api/AdminElmtalq/Candidates/{id}
- **Description:** Soft deletes a candidate (Owner only)

#### Response:
- **Status Code:** 204 No Content
- **Body:** Empty

#### Admin UI Behavior:
- **Action**: Delete button in candidate table/details
- **Access**: Only visible to Owner role
- **Confirmation**: "Are you sure you want to delete this candidate?"
- **Success**: Remove candidate from list, show success message
- **Error**: "Candidate not found" message

---

### Endpoint: Assign Candidate to Employee

- **Method:** PUT
- **URL:** /api/AdminElmtalq/Candidates/{id}/Assign/{secretaryId}
- **Description:** Assigns a candidate to an employee (Owner only)

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether assignment was successful | true |
| Message | string | Status message | "Candidate assigned successfully" |
| Data | object | Assignment confirmation | {CandidateId: 1, SecretaryId: 2} |

#### Admin UI Behavior:
- **Dropdown**: Select employee to assign candidate to
- **Access**: Only visible to Owner role
- **Location**: Candidate details page or candidates table
- **Success**: Update assignment display, refresh data
- **Error**: "Failed to assign candidate" if IDs invalid

---

### Endpoint: Get All Companies

- **Method:** GET
- **URL:** /api/AdminElmtalq/Companies
- **Description:** Retrieves paginated list of companies

#### Request (Query Parameters):
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| page | int | No | Page number (default: 1) | 1 |
| pageSize | int | No | Items per page (default: 10) | 10 |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true if successful | true |
| Message | string | Status message | "Companies retrieved successfully" |
| Data | PagedResult<CompanyAdminResponseDto> | Paginated companies | {Items: [...], TotalCount: 30, PageNumber: 1, PageSize: 10, ...} |

#### Admin UI Behavior:
- **Table**: Companies list with pagination
- **Columns**: Company Name, Contact Phone, Email, Country, City, Required Job, Industry, Assigned Employee, CreatedAt
- **Pagination**: Page numbers, next/prev buttons, items per page selector
- **Actions**: View Details, Edit, Assign (Owner), Delete (Owner)
- **Sorting**: By company name, industry, creation date
- **Filters**: Assigned status, country, industry type

---

### Endpoint: Get Unassigned Companies

- **Method:** GET
- **URL:** /api/AdminElmtalq/Companies/Unassigned
- **Description:** Retrieves companies not assigned to any employee (Owner only)

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true if successful | true |
| Message | string | Status message | "Unassigned companies retrieved successfully" |
| Data | CompanyAdminResponseDto[] | Array of unassigned companies | Array of company objects |

#### Admin UI Behavior:
- **Dropdown**: Companies available for assignment
- **Access**: Only visible to Owner role
- **Use Case**: When assigning companies to employees
- **Display**: Company name, industry, contact for selection

---

### Endpoint: Get Company by ID

- **Method:** GET
- **URL:** /api/AdminElmtalq/Companies/{id}
- **Description:** Retrieves detailed information for a specific company

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether company was found | true |
| Message | string | Status message | "Company retrieved successfully" |
| Data | CompanyAdminResponseDto | Company details | Complete company object |

#### Admin UI Behavior:
- **Details Page**: Complete company profile view
- **Sections**: Company info, contact details, requirements, assignment
- **Assignment Info**: Show assigned employee or "Unassigned"
- **Actions**: Edit, Assign (Owner), Delete (Owner)
- **Error**: "Company not found" message

---

### Endpoint: Update Company

- **Method:** PUT
- **URL:** /api/AdminElmtalq/Companies/{id}
- **Description:** Updates all company information

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| CompanyName | string | Yes | Company name | "Updated Company" |
| ContactPhone | string | Yes | Contact phone | "+201122233344" |
| Email | string | Yes | Company email | "updated@company.com" |
| Country | string | Yes | Country | "Egypt" |
| City | string | Yes | City | "Cairo" |
| RequiredJobTitle | string | Yes | Required job title | "Updated Position" |
| CompanyIndustry | string | Yes | Industry type | "Technology" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Company updated successfully" |
| Data | CompanyAdminResponseDto | Updated company data | Company object |

#### Admin UI Behavior:
- **Form**: Complete company edit form
- **Validation**: All required fields must be provided
- **Success**: Refresh company details, show success message
- **Error**: Field validation errors, "Company not found"

---

### Endpoint: Patch Company

- **Method:** PATCH
- **URL:** /api/AdminElmtalq/Companies/{id}
- **Description:** Partially updates company information

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| CompanyName | string? | No | Company name | "Updated Company" |
| ContactPhone | string? | No | Contact phone | "+201122233344" |
| Email | string? | No | Company email | "updated@company.com" |
| Country | string? | No | Country | "Egypt" |
| City | string? | No | City | "Cairo" |
| RequiredJobTitle | string? | No | Required job title | "Updated Position" |
| CompanyIndustry | string? | No | Industry type | "Technology" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Company updated successfully" |
| Data | CompanyAdminResponseDto | Updated company data | Company object |

#### Admin UI Behavior:
- **Inline Edit**: Quick updates without full form
- **Fields**: Update only specific fields that changed
- **Success**: Refresh only updated data
- **Error**: Validation errors, "Company not found"

---

### Endpoint: Delete Company

- **Method:** DELETE
- **URL:** /api/AdminElmtalq/Companies/{id}
- **Description:** Soft deletes a company (Owner only)

#### Response:
- **Status Code:** 204 No Content
- **Body:** Empty

#### Admin UI Behavior:
- **Action**: Delete button in company table/details
- **Access**: Only visible to Owner role
- **Confirmation**: "Are you sure you want to delete this company?"
- **Success**: Remove company from list, show success message
- **Error**: "Company not found" message

---

### Endpoint: Assign Company to Employee

- **Method:** PUT
- **URL:** /api/AdminElmtalq/Companies/{id}/Assign/{secretaryId}
- **Description:** Assigns a company to an employee (Owner only)

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether assignment was successful | true |
| Message | string | Status message | "Company assigned successfully" |
| Data | object | Assignment confirmation | {CompanyId: 1, SecretaryId: 2} |

#### Admin UI Behavior:
- **Dropdown**: Select employee to assign company to
- **Access**: Only visible to Owner role
- **Location**: Company details page or companies table
- **Success**: Update assignment display, refresh data
- **Error**: "Failed to assign company" if IDs invalid

---

### Endpoint: Search

- **Method:** GET
- **URL:** /api/AdminElmtalq/Search
- **Description:** Advanced search for candidates and companies with filters

#### Request (Query Parameters):
**Candidate Search:**
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| candidateSearch.CandidateName | string? | No | Filter by candidate name | "Ahmed" |
| candidateSearch.JobTitle | string? | No | Filter by job title | "Developer" |
| candidateSearch.YearsOfExperience | int? | No | Filter by years of experience | 5 |
| candidateSearch.EducationalQualification | int? | No | Filter by education level | 2 |
| candidateSearch.Country | string? | No | Filter by country | "Egypt" |
| candidateSearch.GraduationYear | int? | No | Filter by graduation year | 2020 |
| candidateSearch.AssignedEmployeeId | int? | No | Filter by assigned employee | 3 |
| candidateSearch.PageNumber | int | No | Page number (default: 1) | 1 |
| candidateSearch.PageSize | int | No | Items per page (default: 10) | 10 |

**Company Search:**
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| companySearch.CompanyName | string? | No | Filter by company name | "Tech" |
| companySearch.RequiredJobTitle | string? | No | Filter by required job | "Developer" |
| companySearch.Country | string? | No | Filter by country | "Egypt" |
| companySearch.AssignedEmployeeId | int? | No | Filter by assigned employee | 3 |
| companySearch.PageNumber | int | No | Page number (default: 1) | 1 |
| companySearch.PageSize | int | No | Items per page (default: 10) | 10 |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Always true if successful | true |
| Message | string | Status message | "Search completed successfully" |
| Data | object | Search results | {Candidates: [...], Companies: [...]} |

#### Admin UI Behavior:
- **Search Form**: Advanced search with multiple filter fields
- **Tabs**: Separate sections for candidate and company search
- **Filters**: Multiple filter combinations possible
- **Results**: Display results in respective tables with pagination
- **Real-time**: Search as user types or on submit button
- **Reset**: Clear all filters button
- **Save**: Save search functionality for frequent searches

---

### Endpoint: Update About Information

- **Method:** PATCH
- **URL:** /api/AdminElmtalq/About
- **Description:** Updates company information for About page (Owner only)

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| CompanyDescription | string? | No | Company description | "We are a leading company..." |
| OfficeLocation | string? | No | Office location | "https://maps.google.com/..." |
| Facebook | string? | No | Facebook URL | "https://facebook.com/..." |
| Instagram | string? | No | Instagram URL | "https://instagram.com/..." |
| WhatsApp | string? | No | WhatsApp number | "+201122233344" |
| LinkedIn | string? | No | LinkedIn URL | "https://linkedin.com/..." |
| ContactEmail | string? | No | Contact email | "info@company.com" |
| ContactPhone | string? | No | Contact phone | "+201122233344" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Company information updated successfully" |
| Data | AboutResponseDto | Updated information | Updated about data |

#### Admin UI Behavior:
- **Form**: Company information management form
- **Access**: Only visible to Owner role
- **Sections**: About section, Contact section
- **Rich Text**: Text editor for company description
- **URL Validation**: Validate social media URLs
- **Success**: Show success message, preview changes
- **Error**: Validation errors, update failed message

---

### Endpoint: Update Contact Information

- **Method:** PATCH
- **URL:** /api/AdminElmtalq/Contact
- **Description:** Updates contact information (Owner only)

#### Request:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| CompanyDescription | string? | No | Company description | "We are a leading company..." |
| OfficeLocation | string? | No | Office location | "https://maps.google.com/..." |
| Facebook | string? | No | Facebook URL | "https://facebook.com/..." |
| Instagram | string? | No | Instagram URL | "https://instagram.com/..." |
| WhatsApp | string? | No | WhatsApp number | "+201122233344" |
| LinkedIn | string? | No | LinkedIn URL | "https://linkedin.com/..." |
| ContactEmail | string? | No | Contact email | "info@company.com" |
| ContactPhone | string? | No | Contact phone | "+201122233344" |

#### Response:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| Success | bool | Whether update was successful | true |
| Message | string | Status message | "Contact information updated successfully" |
| Data | ContactResponseDto | Updated contact data | Updated contact information |

#### Admin UI Behavior:
- **Form**: Contact information management form
- **Access**: Only visible to Owner role
- **Fields**: Social media links, contact details
- **URL Validation**: Validate social media URLs
- **Success**: Show success message, preview changes
- **Error**: Validation errors, update failed message

---

## 5. Relationships

### Employee Relationships
- **Employee** has **Many Candidates** (One-to-Many)
  - An employee can be assigned multiple candidates to manage
  - Each candidate can be assigned to only one employee (or none)
- **Employee** has **Many Companies** (One-to-Many)
  - An employee can be assigned multiple companies to manage
  - Each company can be assigned to only one employee (or none)

### Assignment Relationships
- **Candidate** belongs to **Employee** (Many-to-One)
  - `AssignedEmployeeId` foreign key references `Employee.Id`
  - Optional relationship - candidate can be unassigned
- **Company** belongs to **Employee** (Many-to-One)
  - `AssignedEmployeeId` foreign key references `Employee.Id`
  - Optional relationship - company can be unassigned

### Independent Entities
- **CompanyInfo** is a standalone entity
  - Only one record expected for the entire system
  - Contains general company information for public pages
  - No direct relationships to other entities

### Soft Delete Behavior
- All entities use soft delete through `IsDeleted` flag
- Deleted records are filtered out from queries by default
- `DeletedAt` timestamp is set when record is soft deleted

---

## 6. Important UX Notes

### Required Fields Validation
**Candidate Creation:**
- FullName (required, max 200 characters)
- PhoneNumber (required, max 20 characters, phone format)
- JobTitle (required, max 200 characters)
- Gender (required, Male/Female selection)

**Company Creation:**
- CompanyName (required, max 200 characters)
- ContactPhone (required, max 20 characters, phone format)
- Email (required, max 255 characters, email format)
- Country (required, max 100 characters)
- City (required, max 100 characters)
- RequiredJobTitle (required, max 200 characters)
- CompanyIndustry (required, max 200 characters)

**Employee Management:**
- Name (required, max 200 characters)
- Email (required, max 255 characters, must be unique)
- Password (required for creation)
- Role (required, Owner/Secretary selection)
- Salary (required, decimal format)

### Enum Values (Dropdown Options)

**Gender:**
- 0 = Male
- 1 = Female

**UserRole:**
- 0 = Owner (Full access)
- 1 = Secretary (Limited access)

**EducationalQualification:**
- 0 = High School
- 1 = Diploma
- 2 = Bachelor
- 3 = Master
- 4 = PhD
- 5 = Other

**FileType:** (For file uploads)
- 0 = CV
- 1 = Personal Photo
- 2 = Introduction Video

### Conditional Fields
**Candidate Optional Fields:**
- EducationalQualification (optional dropdown)
- YearsOfExperience (optional number)
- GraduationYear (optional number)
- Country (optional text)
- Governorate (optional text)
- File uploads (all optional)

### Status Fields
**Employee Status:**
- IsActive (boolean) - determines if employee can login
- IsDeleted (boolean) - soft delete flag (admin only)

**General Status:**
- IsDeleted (boolean) - soft delete for all entities
- CreatedAt/UpdatedAt - automatic timestamps

### File Upload Constraints
**Supported File Types:**
- CV: PDF files only
- Personal Photo: JPG, PNG files
- Introduction Video: MP4 files

**File Size Limits:** (Check actual limits in configuration)
- Maximum file sizes should be displayed to users
- Progress indicators for upload status
- Error handling for unsupported formats

### Role-Based Access Control
**Owner Role (Full Access):**
- Create, update, delete employees
- Assign candidates/companies to employees
- Delete candidates/companies
- Update company information
- View all data

**Secretary Role (Limited Access):**
- View assigned candidates/companies only
- Update candidate/company information
- Cannot delete records
- Cannot manage employees
- Cannot assign items to others

### Search and Filtering
**Candidate Search Filters:**
- Name (text search)
- Job Title (text search)
- Years of Experience (exact match)
- Education Level (dropdown)
- Country (dropdown/text)
- Graduation Year (exact match)
- Assigned Employee (dropdown)

**Company Search Filters:**
- Company Name (text search)
- Required Job Title (text search)
- Country (dropdown/text)
- Assigned Employee (dropdown)

### Pagination
**Default Settings:**
- Page size: 10 items per page
- Page number starts from 1
- Total pages calculated automatically
- Previous/Next navigation
- Page size selector (5, 10, 25, 50 options)

### Error Handling
**Common Error Messages:**
- "Validation failed" - with field-specific errors
- "Email already exists" - for duplicate emails
- "Invalid email or password" - for login failures
- "Not found" - when record doesn't exist
- "Unauthorized" - for insufficient permissions

**Success Messages:**
- "Created successfully"
- "Updated successfully"
- "Deleted successfully"
- "Assigned successfully"

### UI Components Needed
**Forms:**
- Multi-step candidate registration with file uploads
- Company registration form
- Employee management form
- Login form
- Advanced search form

**Tables:**
- Candidates list (with pagination, sorting, filters)
- Companies list (with pagination, sorting, filters)
- Employees list (simple table for owners)

**Details Views:**
- Candidate profile with file downloads
- Company profile
- Employee profile

**Special Components:**
- Assignment dropdowns
- File upload widgets
- Rich text editor for company description
- Role-based navigation menus
- Search/filter panels
