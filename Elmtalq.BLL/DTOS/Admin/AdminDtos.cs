using Elmtalq.DAL.Enums;

namespace Elmtalq.BLL.DTOS.Admin;

// Authentication DTOs
public class LoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
}

// Employee DTOs
public class EmployeeCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public decimal Salary { get; set; }
}

public class EmployeeUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public decimal Salary { get; set; }
    public bool IsActive { get; set; }
}

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public decimal Salary { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

// Candidate DTOs for Admin
public class CandidateAdminResponseDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public EducationalQualification? EducationalQualification { get; set; }
    public int? YearsOfExperience { get; set; }
    public int? GraduationYear { get; set; }
    public string? Country { get; set; }
    public string? Governorate { get; set; }
    public string? CVFilePath { get; set; }
    public string? PersonalPhotoFilePath { get; set; }
    public string? IntroductionVideoFilePath { get; set; }
    public int? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CandidateUpdateDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    public EducationalQualification? EducationalQualification { get; set; }
    public int? YearsOfExperience { get; set; }
    public int? GraduationYear { get; set; }
    public string? Country { get; set; }
    public string? Governorate { get; set; }
}

// Company DTOs for Admin
public class CompanyAdminResponseDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string RequiredJobTitle { get; set; } = string.Empty;
    public string CompanyIndustry { get; set; } = string.Empty;
    public int? AssignedEmployeeId { get; set; }
    public string? AssignedEmployeeName { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CompanyUpdateDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string RequiredJobTitle { get; set; } = string.Empty;
    public string CompanyIndustry { get; set; } = string.Empty;
}

// Assignment DTO
public class AssignmentDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
}

// Search DTOs
public class CandidateSearchDto
{
    public string? CandidateName { get; set; }
    public string? JobTitle { get; set; }
    public int? YearsOfExperience { get; set; }
    public EducationalQualification? EducationalQualification { get; set; }
    public string? Country { get; set; }
    public int? GraduationYear { get; set; }
    public int? AssignedEmployeeId { get; set; }
}

public class CompanySearchDto
{
    public string? CompanyName { get; set; }
    public string? RequiredJobTitle { get; set; }
    public string? Country { get; set; }
    public int? AssignedEmployeeId { get; set; }
}

// Pagination DTO
public class PagedResultDto<T>
{
    public IEnumerable<T> Data { get; set; } = new List<T>();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
    public bool HasPreviousPage { get; set; }
    public bool HasNextPage { get; set; }
}
