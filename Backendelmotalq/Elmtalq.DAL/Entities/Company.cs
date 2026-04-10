namespace Elmtalq.DAL.Entities;

public class Company : BaseEntity
{
    public string CompanyName { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string RequiredJobTitle { get; set; } = string.Empty;
    public string CompanyIndustry { get; set; } = string.Empty;
    
    // Assignment
    public int? AssignedEmployeeId { get; set; }
    public Employee? AssignedEmployee { get; set; }
}
