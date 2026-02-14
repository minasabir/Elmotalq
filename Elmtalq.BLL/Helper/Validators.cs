using FluentValidation;
using Microsoft.AspNetCore.Http;
using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.DAL.Enums;

namespace Elmtalq.BLL.Helper;

// Public Website Validators
public class CandidateCreateDtoValidator : AbstractValidator<CandidateCreateDto>
{
    public CandidateCreateDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200).WithMessage("Full name cannot exceed 200 characters");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .MaximumLength(20).WithMessage("Phone number cannot exceed 20 characters");

        RuleFor(x => x.JobTitle)
            .NotEmpty().WithMessage("Job title is required")
            .MaximumLength(200).WithMessage("Job title cannot exceed 200 characters");

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Invalid gender value");

        RuleFor(x => x.YearsOfExperience)
            .GreaterThanOrEqualTo(0).When(x => x.YearsOfExperience.HasValue)
            .WithMessage("Years of experience must be non-negative");

        RuleFor(x => x.GraduationYear)
            .InclusiveBetween(1950, DateTime.Now.Year).When(x => x.GraduationYear.HasValue)
            .WithMessage($"Graduation year must be between 1950 and {DateTime.Now.Year}");

        RuleFor(x => x.Country)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Country))
            .WithMessage("Country cannot exceed 100 characters");

        RuleFor(x => x.Governorate)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Governorate))
            .WithMessage("Governorate cannot exceed 100 characters");

        RuleFor(x => x.CVFile)
            .Must(BeValidFile).When(x => x.CVFile != null)
            .WithMessage("CV file must be a valid document (PDF, DOC, DOCX) and not exceed 10MB");

        RuleFor(x => x.PersonalPhotoFile)
            .Must(BeValidImage).When(x => x.PersonalPhotoFile != null)
            .WithMessage("Personal photo must be a valid image (JPG, PNG, GIF) and not exceed 5MB");

        RuleFor(x => x.IntroductionVideoFile)
            .Must(BeValidVideo).When(x => x.IntroductionVideoFile != null)
            .WithMessage("Introduction video must be a valid video file (MP4, AVI, MOV) and not exceed 50MB");
    }

    private bool BeValidFile(IFormFile? file)
    {
        if (file == null) return false;
        
        var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        return allowedExtensions.Contains(extension) && file.Length <= 10 * 1024 * 1024; // 10MB
    }

    private bool BeValidImage(IFormFile? file)
    {
        if (file == null) return false;
        
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        return allowedExtensions.Contains(extension) && file.Length <= 5 * 1024 * 1024; // 5MB
    }

    private bool BeValidVideo(IFormFile? file)
    {
        if (file == null) return false;
        
        var allowedExtensions = new[] { ".mp4", ".avi", ".mov" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        return allowedExtensions.Contains(extension) && file.Length <= 50 * 1024 * 1024; // 50MB
    }
}

public class CompanyCreateDtoValidator : AbstractValidator<CompanyCreateDto>
{
    public CompanyCreateDtoValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required")
            .MaximumLength(200).WithMessage("Company name cannot exceed 200 characters");

        RuleFor(x => x.ContactPhone)
            .NotEmpty().WithMessage("Contact phone is required")
            .MaximumLength(20).WithMessage("Contact phone cannot exceed 20 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(100).WithMessage("Country cannot exceed 100 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters");

        RuleFor(x => x.RequiredJobTitle)
            .NotEmpty().WithMessage("Required job title is required")
            .MaximumLength(200).WithMessage("Required job title cannot exceed 200 characters");

        RuleFor(x => x.CompanyIndustry)
            .NotEmpty().WithMessage("Company industry is required")
            .MaximumLength(200).WithMessage("Company industry cannot exceed 200 characters");
    }
}

// Admin Dashboard Validators
public class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}

public class EmployeeCreateDtoValidator : AbstractValidator<EmployeeCreateDto>
{
    public EmployeeCreateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name cannot exceed 200 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Invalid role value");

        RuleFor(x => x.Salary)
            .GreaterThan(0).WithMessage("Salary must be greater than 0");
    }
}

public class EmployeeUpdateDtoValidator : AbstractValidator<EmployeeUpdateDto>
{
    public EmployeeUpdateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name cannot exceed 200 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Invalid role value");

        RuleFor(x => x.Salary)
            .GreaterThan(0).WithMessage("Salary must be greater than 0");
    }
}

public class CandidateUpdateDtoValidator : AbstractValidator<CandidateUpdateDto>
{
    public CandidateUpdateDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(200).WithMessage("Full name cannot exceed 200 characters");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .MaximumLength(20).WithMessage("Phone number cannot exceed 20 characters");

        RuleFor(x => x.JobTitle)
            .NotEmpty().WithMessage("Job title is required")
            .MaximumLength(200).WithMessage("Job title cannot exceed 200 characters");

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Invalid gender value");

        RuleFor(x => x.YearsOfExperience)
            .GreaterThanOrEqualTo(0).When(x => x.YearsOfExperience.HasValue)
            .WithMessage("Years of experience must be non-negative");

        RuleFor(x => x.GraduationYear)
            .InclusiveBetween(1950, DateTime.Now.Year).When(x => x.GraduationYear.HasValue)
            .WithMessage($"Graduation year must be between 1950 and {DateTime.Now.Year}");

        RuleFor(x => x.Country)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Country))
            .WithMessage("Country cannot exceed 100 characters");

        RuleFor(x => x.Governorate)
            .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Governorate))
            .WithMessage("Governorate cannot exceed 100 characters");
    }
}

public class CompanyUpdateDtoValidator : AbstractValidator<CompanyUpdateDto>
{
    public CompanyUpdateDtoValidator()
    {
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("Company name is required")
            .MaximumLength(200).WithMessage("Company name cannot exceed 200 characters");

        RuleFor(x => x.ContactPhone)
            .NotEmpty().WithMessage("Contact phone is required")
            .MaximumLength(20).WithMessage("Contact phone cannot exceed 20 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(100).WithMessage("Country cannot exceed 100 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City cannot exceed 100 characters");

        RuleFor(x => x.RequiredJobTitle)
            .NotEmpty().WithMessage("Required job title is required")
            .MaximumLength(200).WithMessage("Required job title cannot exceed 200 characters");

        RuleFor(x => x.CompanyIndustry)
            .NotEmpty().WithMessage("Company industry is required")
            .MaximumLength(200).WithMessage("Company industry cannot exceed 200 characters");
    }
}
