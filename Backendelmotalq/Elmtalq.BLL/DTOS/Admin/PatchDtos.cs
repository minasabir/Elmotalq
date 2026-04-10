using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.DAL.Enums;

namespace Elmtalq.BLL.DTOS.Admin;

public class EmployeePatchDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public UserRole? Role { get; set; }
    public decimal? Salary { get; set; }
    public bool? IsActive { get; set; }
}

public class CandidatePatchDto
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? JobTitle { get; set; }
    public Gender? Gender { get; set; }
    public EducationalQualification? EducationalQualification { get; set; }
    public int? YearsOfExperience { get; set; }
    public int? GraduationYear { get; set; }
    public string? Country { get; set; }
    public string? Governorate { get; set; }
}

public class CompanyPatchDto
{
    public string? CompanyName { get; set; }
    public string? ContactPhone { get; set; }
    public string? Email { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? RequiredJobTitle { get; set; }
    public string? CompanyIndustry { get; set; }
}

public class AboutPatchDto
{
    public string? CompanyDescription { get; set; }
    public string? OfficeLocation { get; set; }
    public string? Facebook { get; set; }
    public string? Instagram { get; set; }
    public string? WhatsApp { get; set; }
    public string? LinkedIn { get; set; }
    public string? ContactEmail { get; set; }
    public string? ContactPhone { get; set; }
}
