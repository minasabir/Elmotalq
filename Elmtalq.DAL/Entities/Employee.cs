using Elmtalq.DAL.Enums;

namespace Elmtalq.DAL.Entities;

public class Employee : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public decimal Salary { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public ICollection<Candidate> AssignedCandidates { get; set; } = new List<Candidate>();
    public ICollection<Company> AssignedCompanies { get; set; } = new List<Company>();
}
