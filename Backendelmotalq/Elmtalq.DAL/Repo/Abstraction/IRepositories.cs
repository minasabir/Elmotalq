using Elmtalq.DAL.Entities;

namespace Elmtalq.DAL.Repo.Abstraction;

public interface IEmployeeRepository : IGenericRepository<Employee>
{
    Task<Employee?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
}

public interface ICandidateRepository : IGenericRepository<Candidate>
{
    Task<IEnumerable<Candidate>> GetUnassignedCandidatesAsync();
    Task<IEnumerable<Candidate>> GetCandidatesByEmployeeIdAsync(int employeeId);
}

public interface ICompanyRepository : IGenericRepository<Company>
{
    Task<IEnumerable<Company>> GetUnassignedCompaniesAsync();
    Task<IEnumerable<Company>> GetCompaniesByEmployeeIdAsync(int employeeId);
}

public interface ICompanyInfoRepository : IGenericRepository<CompanyInfo>
{
    Task<CompanyInfo?> GetFirstAsync();
}
