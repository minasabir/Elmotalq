using Microsoft.EntityFrameworkCore;
using Elmtalq.DAL.Database;
using Elmtalq.DAL.Entities;
using Elmtalq.DAL.Repo.Abstraction;

namespace Elmtalq.DAL.Repo.Implementation;

public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
{
    public EmployeeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Employee?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(e => e.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(e => e.Email == email);
    }
}

public class CandidateRepository : GenericRepository<Candidate>, ICandidateRepository
{
    public CandidateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Candidate>> GetUnassignedCandidatesAsync()
    {
        return await _dbSet.Where(c => c.AssignedEmployeeId == null).ToListAsync();
    }

    public async Task<IEnumerable<Candidate>> GetCandidatesByEmployeeIdAsync(int employeeId)
    {
        return await _dbSet.Where(c => c.AssignedEmployeeId == employeeId).ToListAsync();
    }
}

public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
{
    public CompanyRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Company>> GetUnassignedCompaniesAsync()
    {
        return await _dbSet.Where(c => c.AssignedEmployeeId == null).ToListAsync();
    }

    public async Task<IEnumerable<Company>> GetCompaniesByEmployeeIdAsync(int employeeId)
    {
        return await _dbSet.Where(c => c.AssignedEmployeeId == employeeId).ToListAsync();
    }
}

public class CompanyInfoRepository : GenericRepository<CompanyInfo>, ICompanyInfoRepository
{
    public CompanyInfoRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CompanyInfo?> GetFirstAsync()
    {
        return await _dbSet.FirstOrDefaultAsync();
    }
}
