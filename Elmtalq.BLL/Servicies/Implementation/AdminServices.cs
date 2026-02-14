using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Elmtalq.DAL.Entities;
using Elmtalq.DAL.Repo.Abstraction;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.BLL.Helper;
using Elmtalq.BLL.Servicies.Abstraction;

namespace Elmtalq.BLL.Servicies.Implementation;

public class CandidateAdminService : ICandidateAdminService
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public CandidateAdminService(ICandidateRepository candidateRepository, IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _candidateRepository = candidateRepository;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<CandidateAdminResponseDto?> GetCandidateByIdAsync(int id)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id, c => c.AssignedEmployee);
        return candidate != null ? _mapper.Map<CandidateAdminResponseDto>(candidate) : null;
    }

    public async Task<IEnumerable<CandidateAdminResponseDto>> GetAllCandidatesAsync()
    {
        var candidates = await _candidateRepository.GetAllAsync(c => c.AssignedEmployee);
        return _mapper.Map<IEnumerable<CandidateAdminResponseDto>>(candidates) ?? new List<CandidateAdminResponseDto>();
    }

    public async Task<IEnumerable<CandidateAdminResponseDto>> GetUnassignedCandidatesAsync()
    {
        var candidates = await _candidateRepository.GetUnassignedCandidatesAsync();
        return _mapper.Map<IEnumerable<CandidateAdminResponseDto>>(candidates) ?? new List<CandidateAdminResponseDto>();
    }

    public async Task<IEnumerable<CandidateAdminResponseDto>> GetCandidatesByEmployeeIdAsync(int employeeId)
    {
        var candidates = await _candidateRepository.GetCandidatesByEmployeeIdAsync(employeeId);
        return _mapper.Map<IEnumerable<CandidateAdminResponseDto>>(candidates) ?? new List<CandidateAdminResponseDto>();
    }

    public async Task<IEnumerable<CandidateAdminResponseDto>> SearchCandidatesAsync(CandidateSearchDto searchDto)
    {
        var query = await _candidateRepository.GetAllAsync(c => c.AssignedEmployee);
        
        var candidates = query.AsQueryable();

        if (!string.IsNullOrEmpty(searchDto.CandidateName))
            candidates = candidates.Where(c => c.FullName.Contains(searchDto.CandidateName));

        if (!string.IsNullOrEmpty(searchDto.JobTitle))
            candidates = candidates.Where(c => c.JobTitle.Contains(searchDto.JobTitle));

        if (searchDto.YearsOfExperience.HasValue)
            candidates = candidates.Where(c => c.YearsOfExperience == searchDto.YearsOfExperience);

        if (searchDto.EducationalQualification.HasValue)
            candidates = candidates.Where(c => c.EducationalQualification == searchDto.EducationalQualification);

        if (!string.IsNullOrEmpty(searchDto.Country))
            candidates = candidates.Where(c => c.Country != null && c.Country.Contains(searchDto.Country));

        if (searchDto.GraduationYear.HasValue)
            candidates = candidates.Where(c => c.GraduationYear == searchDto.GraduationYear);

        if (searchDto.AssignedEmployeeId.HasValue)
            candidates = candidates.Where(c => c.AssignedEmployeeId == searchDto.AssignedEmployeeId);

        return _mapper.Map<IEnumerable<CandidateAdminResponseDto>>(candidates.ToList());
    }

    public async Task<CandidateAdminResponseDto?> UpdateCandidateAsync(int id, CandidateUpdateDto dto)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id);
        if (candidate == null) return null;

        _mapper.Map(dto, candidate);
        await _candidateRepository.UpdateAsync(candidate);

        return _mapper.Map<CandidateAdminResponseDto>(candidate);
    }

    public async Task<CandidateAdminResponseDto?> PatchCandidateAsync(int id, CandidatePatchDto dto)
    {
        var candidate = await _candidateRepository.GetByIdAsync(id);
        if (candidate == null) return null;

        // Apply only non-null values
        if (!string.IsNullOrEmpty(dto.FullName))
            candidate.FullName = dto.FullName;
        
        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            candidate.PhoneNumber = dto.PhoneNumber;
        
        if (!string.IsNullOrEmpty(dto.JobTitle))
            candidate.JobTitle = dto.JobTitle;
        
        if (dto.Gender.HasValue)
            candidate.Gender = dto.Gender.Value;
        
        if (dto.EducationalQualification.HasValue)
            candidate.EducationalQualification = dto.EducationalQualification.Value;
        
        if (dto.YearsOfExperience.HasValue)
            candidate.YearsOfExperience = dto.YearsOfExperience.Value;
        
        if (dto.GraduationYear.HasValue)
            candidate.GraduationYear = dto.GraduationYear.Value;
        
        if (!string.IsNullOrEmpty(dto.Country))
            candidate.Country = dto.Country;
        
        if (!string.IsNullOrEmpty(dto.Governorate))
            candidate.Governorate = dto.Governorate;

        await _candidateRepository.UpdateAsync(candidate);
        return _mapper.Map<CandidateAdminResponseDto>(candidate);
    }

    public async Task<bool> DeleteCandidateAsync(int id)
    {
        await _candidateRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> AssignCandidateToEmployeeAsync(int candidateId, int employeeId)
    {
        var candidate = await _candidateRepository.GetByIdAsync(candidateId);
        var employee = await _employeeRepository.GetByIdAsync(employeeId);

        if (candidate == null || employee == null)
            return false;

        candidate.AssignedEmployeeId = employeeId;
        await _candidateRepository.UpdateAsync(candidate);

        return true;
    }
}

public class CompanyAdminService : ICompanyAdminService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public CompanyAdminService(ICompanyRepository companyRepository, IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _companyRepository = companyRepository;
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<CompanyAdminResponseDto?> GetCompanyByIdAsync(int id)
    {
        var company = await _companyRepository.GetByIdAsync(id, c => c.AssignedEmployee);
        return company != null ? _mapper.Map<CompanyAdminResponseDto>(company) : null;
    }

    public async Task<IEnumerable<CompanyAdminResponseDto>> GetAllCompaniesAsync()
    {
        var companies = await _companyRepository.GetAllAsync(c => c.AssignedEmployee);
        return _mapper.Map<IEnumerable<CompanyAdminResponseDto>>(companies) ?? new List<CompanyAdminResponseDto>();
    }

    public async Task<IEnumerable<CompanyAdminResponseDto>> GetUnassignedCompaniesAsync()
    {
        var companies = await _companyRepository.GetUnassignedCompaniesAsync();
        return _mapper.Map<IEnumerable<CompanyAdminResponseDto>>(companies) ?? new List<CompanyAdminResponseDto>();
    }

    public async Task<IEnumerable<CompanyAdminResponseDto>> GetCompaniesByEmployeeIdAsync(int employeeId)
    {
        var companies = await _companyRepository.GetCompaniesByEmployeeIdAsync(employeeId);
        return _mapper.Map<IEnumerable<CompanyAdminResponseDto>>(companies) ?? new List<CompanyAdminResponseDto>();
    }

    public async Task<IEnumerable<CompanyAdminResponseDto>> SearchCompaniesAsync(CompanySearchDto searchDto)
    {
        var query = await _companyRepository.GetAllAsync(c => c.AssignedEmployee);
        
        var companies = query.AsQueryable();

        if (!string.IsNullOrEmpty(searchDto.CompanyName))
            companies = companies.Where(c => c.CompanyName.Contains(searchDto.CompanyName));

        if (!string.IsNullOrEmpty(searchDto.RequiredJobTitle))
            companies = companies.Where(c => c.RequiredJobTitle.Contains(searchDto.RequiredJobTitle));

        if (!string.IsNullOrEmpty(searchDto.Country))
            companies = companies.Where(c => c.Country.Contains(searchDto.Country));

        if (searchDto.AssignedEmployeeId.HasValue)
            companies = companies.Where(c => c.AssignedEmployeeId == searchDto.AssignedEmployeeId);

        return _mapper.Map<IEnumerable<CompanyAdminResponseDto>>(companies.ToList());
    }

    public async Task<CompanyAdminResponseDto?> UpdateCompanyAsync(int id, CompanyUpdateDto dto)
    {
        var company = await _companyRepository.GetByIdAsync(id);
        if (company == null) return null;

        _mapper.Map(dto, company);
        await _companyRepository.UpdateAsync(company);

        return _mapper.Map<CompanyAdminResponseDto>(company);
    }

    public async Task<CompanyAdminResponseDto?> PatchCompanyAsync(int id, CompanyPatchDto dto)
    {
        var company = await _companyRepository.GetByIdAsync(id);
        if (company == null) return null;

        // Apply only non-null values
        if (!string.IsNullOrEmpty(dto.CompanyName))
            company.CompanyName = dto.CompanyName;
        
        if (!string.IsNullOrEmpty(dto.ContactPhone))
            company.ContactPhone = dto.ContactPhone;
        
        if (!string.IsNullOrEmpty(dto.Email))
            company.Email = dto.Email;
        
        if (!string.IsNullOrEmpty(dto.Country))
            company.Country = dto.Country;
        
        if (!string.IsNullOrEmpty(dto.City))
            company.City = dto.City;
        
        if (!string.IsNullOrEmpty(dto.RequiredJobTitle))
            company.RequiredJobTitle = dto.RequiredJobTitle;
        
        if (!string.IsNullOrEmpty(dto.CompanyIndustry))
            company.CompanyIndustry = dto.CompanyIndustry;

        await _companyRepository.UpdateAsync(company);
        return _mapper.Map<CompanyAdminResponseDto>(company);
    }

    public async Task<bool> DeleteCompanyAsync(int id)
    {
        await _companyRepository.DeleteAsync(id);
        return true;
    }

    public async Task<bool> AssignCompanyToEmployeeAsync(int companyId, int employeeId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId);
        var employee = await _employeeRepository.GetByIdAsync(employeeId);

        if (company == null || employee == null)
            return false;

        company.AssignedEmployeeId = employeeId;
        await _companyRepository.UpdateAsync(company);

        return true;
    }
}
