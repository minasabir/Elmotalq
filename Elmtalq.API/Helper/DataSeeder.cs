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
    }
}
