namespace Elmtalq.DAL.Entities;

public class CompanyInfo : BaseEntity
{
    public string CompanyDescription { get; set; } = string.Empty;
    public string OfficeLocation { get; set; } = string.Empty; // Google Maps link or coordinates
    
    // Contact information
    public string Facebook { get; set; } = string.Empty;
    public string Instagram { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string LinkedIn { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
}
