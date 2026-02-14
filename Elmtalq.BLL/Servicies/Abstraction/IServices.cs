using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.DAL.Enums;

namespace Elmtalq.BLL.Servicies.Abstraction;

// Public Website Services
public interface ICandidateService
{
    Task<CandidateResponseDto> CreateCandidateAsync(CandidateCreateDto dto);
}

public interface ICompanyService
{
    Task<CompanyResponseDto> CreateCompanyAsync(CompanyCreateDto dto);
}

public interface ICompanyInfoService
{
    Task<AboutResponseDto?> GetAboutAsync();
    Task<ContactResponseDto?> GetContactAsync();
    Task<AboutResponseDto?> UpdateAboutAsync(AboutPatchDto dto);
    Task<ContactResponseDto?> UpdateContactAsync(AboutPatchDto dto);
}

// Admin Dashboard Services
public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto);
    string GenerateJwtToken(int userId, string email, string name, UserRole role);
}

public interface IEmployeeService
{
    Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto);
    Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id);
    Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync();
    Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, EmployeeUpdateDto dto);
    Task<EmployeeResponseDto?> PatchEmployeeAsync(int id, EmployeePatchDto dto);
    Task<bool> DeleteEmployeeAsync(int id);
    Task<bool> EmailExistsAsync(string email);
}

public interface ICandidateAdminService
{
    Task<CandidateAdminResponseDto?> GetCandidateByIdAsync(int id);
    Task<IEnumerable<CandidateAdminResponseDto>> GetAllCandidatesAsync();
    Task<IEnumerable<CandidateAdminResponseDto>> GetUnassignedCandidatesAsync();
    Task<IEnumerable<CandidateAdminResponseDto>> GetCandidatesByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<CandidateAdminResponseDto>> SearchCandidatesAsync(CandidateSearchDto searchDto);
    Task<CandidateAdminResponseDto?> UpdateCandidateAsync(int id, CandidateUpdateDto dto);
    Task<CandidateAdminResponseDto?> PatchCandidateAsync(int id, CandidatePatchDto dto);
    Task<bool> DeleteCandidateAsync(int id);
    Task<bool> AssignCandidateToEmployeeAsync(int candidateId, int employeeId);
}

public interface ICompanyAdminService
{
    Task<CompanyAdminResponseDto?> GetCompanyByIdAsync(int id);
    Task<IEnumerable<CompanyAdminResponseDto>> GetAllCompaniesAsync();
    Task<IEnumerable<CompanyAdminResponseDto>> GetUnassignedCompaniesAsync();
    Task<IEnumerable<CompanyAdminResponseDto>> GetCompaniesByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<CompanyAdminResponseDto>> SearchCompaniesAsync(CompanySearchDto searchDto);
    Task<CompanyAdminResponseDto?> UpdateCompanyAsync(int id, CompanyUpdateDto dto);
    Task<CompanyAdminResponseDto?> PatchCompanyAsync(int id, CompanyPatchDto dto);
    Task<bool> DeleteCompanyAsync(int id);
    Task<bool> AssignCompanyToEmployeeAsync(int companyId, int employeeId);
}
