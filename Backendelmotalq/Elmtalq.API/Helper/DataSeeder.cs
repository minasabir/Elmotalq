using Elmtalq.DAL.Database;
using Elmtalq.DAL.Entities;
using Elmtalq.DAL.Enums;
using BCrypt.Net;

namespace Elmtalq.API.Helper;

public static class DataSeeder
{
    public static async Task SeedData(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.EnsureCreatedAsync();

        if (!context.Employees.Any())
        {
            var owner = new Employee
            {
                Name = "Owner User",
                Email = "owner@elmtalq.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Owner@123"),
                Role = UserRole.Owner,
                Salary = 10000,
                IsActive = true
            };

            var secretary = new Employee
            {
                Name = "Secretary User",
                Email = "secretary@elmtalq.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Secretary@123"),
                Role = UserRole.Secretary,
                Salary = 5000,
                IsActive = true
            };

            await context.Employees.AddRangeAsync(owner, secretary);
            await context.SaveChangesAsync();
        }

        if (!context.Candidates.Any())
        {
            var candidates = new List<Candidate>();
            var random = new Random();
            var secretary = context.Employees.FirstOrDefault(e => e.Email == "secretary@elmtalq.com");

            for (int i = 1; i <= 50; i++)
            {
                var isAssigned = i % 3 == 0; // Assign every 3rd candidate
                candidates.Add(new Candidate
                {
                    FullName = $"Candidate {i}",
                    PhoneNumber = $"+9665000000{i:00}",
                    JobTitle = i % 2 == 0 ? "Software Engineer" : "Marketing Specialist",
                    Gender = (Gender)(i % 2),
                    EducationalQualification = (EducationalQualification)(i % 6),
                    YearsOfExperience = random.Next(0, 15),
                    GraduationYear = random.Next(2010, 2024),
                    Country = "Saudi Arabia",
                    Governorate = i % 2 == 0 ? "Riyadh" : "Jeddah",
                    AssignedEmployeeId = isAssigned ? secretary?.Id : null,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 30))
                });
            }

            await context.Candidates.AddRangeAsync(candidates);
            await context.SaveChangesAsync();
        }

        if (!context.Companies.Any())
        {
            var companies = new List<Company>();
            var random = new Random();
            var secretary = context.Employees.FirstOrDefault(e => e.Email == "secretary@elmtalq.com");

            for (int i = 1; i <= 20; i++)
            {
                var isAssigned = i % 3 == 0; // Assign every 3rd company
                companies.Add(new Company
                {
                    CompanyName = $"Company {i}",
                    ContactPhone = $"+9661100000{i:00}",
                    Email = $"contact@company{i}.com",
                    Country = "Saudi Arabia",
                    City = i % 2 == 0 ? "Riyadh" : "Dammam",
                    RequiredJobTitle = i % 2 == 0 ? "Software Engineer" : "HR Manager",
                    CompanyIndustry = i % 2 == 0 ? "Technology" : "Services",
                    AssignedEmployeeId = isAssigned ? secretary?.Id : null,
                    CreatedAt = DateTime.UtcNow.AddDays(-random.Next(0, 30))
                });
            }

            await context.Companies.AddRangeAsync(companies);
            await context.SaveChangesAsync();
        }

        if (!context.CompanyInfos.Any())
        {
            var companyInfo = new CompanyInfo
            {
                CompanyDescription = "Elmtalq is a leading recruitment agency specialized in connecting top talent with premier organizations across Saudi Arabia. We pride ourselves on our rigorous selection process and our ability to find the perfect match for both candidates and employers.",
                OfficeLocation = "King Fahd Road, Riyadh, Saudi Arabia",
                ContactEmail = "info@elmtalq.com",
                ContactPhone = "+966 11 123 4567",
                Facebook = "https://facebook.com/elmtalq",
                Instagram = "https://instagram.com/elmtalq",
                LinkedIn = "https://linkedin.com/company/elmtalq",
                WhatsApp = "+966 50 123 4567"
            };

            await context.CompanyInfos.AddAsync(companyInfo);
            await context.SaveChangesAsync();
        }
    }
}
