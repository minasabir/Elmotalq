using Microsoft.AspNetCore.Http;
using Elmtalq.DAL.Enums;

namespace Elmtalq.BLL.DTOS.Public;

public class CandidateCreateDto
{
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public Gender Gender { get; set; }
    
    // Optional fields
    public EducationalQualification? EducationalQualification { get; set; }
    public int? YearsOfExperience { get; set; }
    public int? GraduationYear { get; set; }
    public string? Country { get; set; }
    public string? Governorate { get; set; }
    
    // File uploads
    public IFormFile? CVFile { get; set; }
    public IFormFile? PersonalPhotoFile { get; set; }
    public IFormFile? IntroductionVideoFile { get; set; }
}

public class CandidateResponseDto
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
    public DateTime CreatedAt { get; set; }
}

public class CompanyCreateDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string RequiredJobTitle { get; set; } = string.Empty;
    public string CompanyIndustry { get; set; } = string.Empty;
}

public class CompanyResponseDto
{
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string RequiredJobTitle { get; set; } = string.Empty;
    public string CompanyIndustry { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class AboutResponseDto
{
    public string CompanyDescription { get; set; } = string.Empty;
    public string OfficeLocation { get; set; } = string.Empty;
}

public class ContactResponseDto
{
    public string Facebook { get; set; } = string.Empty;
    public string Instagram { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string LinkedIn { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
}
