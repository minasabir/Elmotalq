using Elmtalq.DAL.Enums;

namespace Elmtalq.DAL.Entities;

public class Candidate : BaseEntity
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
    
    // File paths
    public string? CVFilePath { get; set; }
    public string? PersonalPhotoFilePath { get; set; }
    public string? IntroductionVideoFilePath { get; set; }
    
    // Assignment
    public int? AssignedEmployeeId { get; set; }
    public Employee? AssignedEmployee { get; set; }
}
