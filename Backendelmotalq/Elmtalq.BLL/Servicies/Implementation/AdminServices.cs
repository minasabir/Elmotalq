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

    public async Task<PagedResult<CandidateAdminResponseDto>> GetAllCandidatesAsync(int pageNumber = 1, int pageSize = 10)
    {
        IQueryable<Candidate> query = _candidateRepository.GetQueryable().Include(c => c.AssignedEmployee);
        var totalCount = await query.CountAsync();
        
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = _mapper.Map<IEnumerable<CandidateAdminResponseDto>>(items);

        return new PagedResult<CandidateAdminResponseDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
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

    public async Task<PagedResult<CandidateAdminResponseDto>> SearchCandidatesAsync(CandidateSearchDto searchDto)
    {
        IQueryable<Candidate> query = _candidateRepository.GetQueryable().Include(c => c.AssignedEmployee);
        
        if (!string.IsNullOrEmpty(searchDto.CandidateName))
            query = query.Where(c => c.FullName.Contains(searchDto.CandidateName));

        if (!string.IsNullOrEmpty(searchDto.JobTitle))
            query = query.Where(c => c.JobTitle.Contains(searchDto.JobTitle));

        if (searchDto.YearsOfExperience.HasValue)
            query = query.Where(c => c.YearsOfExperience == searchDto.YearsOfExperience);

        if (searchDto.EducationalQualification.HasValue)
            query = query.Where(c => c.EducationalQualification == searchDto.EducationalQualification);

        if (!string.IsNullOrEmpty(searchDto.Country))
            query = query.Where(c => c.Country != null && c.Country.Contains(searchDto.Country));

        if (searchDto.GraduationYear.HasValue)
            query = query.Where(c => c.GraduationYear == searchDto.GraduationYear);

        if (searchDto.AssignedEmployeeId.HasValue)
            query = query.Where(c => c.AssignedEmployeeId == searchDto.AssignedEmployeeId);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<IEnumerable<CandidateAdminResponseDto>>(items);

        return new PagedResult<CandidateAdminResponseDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = searchDto.PageNumber,
            PageSize = searchDto.PageSize
        };
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

    public async Task<PagedResult<CompanyAdminResponseDto>> GetAllCompaniesAsync(int pageNumber = 1, int pageSize = 10)
    {
        IQueryable<Company> query = _companyRepository.GetQueryable().Include(c => c.AssignedEmployee);
        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var dtos = _mapper.Map<IEnumerable<CompanyAdminResponseDto>>(items);

        return new PagedResult<CompanyAdminResponseDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
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

    public async Task<PagedResult<CompanyAdminResponseDto>> SearchCompaniesAsync(CompanySearchDto searchDto)
    {
        IQueryable<Company> query = _companyRepository.GetQueryable().Include(c => c.AssignedEmployee);
        
        if (!string.IsNullOrEmpty(searchDto.CompanyName))
            query = query.Where(c => c.CompanyName.Contains(searchDto.CompanyName));

        if (!string.IsNullOrEmpty(searchDto.RequiredJobTitle))
            query = query.Where(c => c.RequiredJobTitle.Contains(searchDto.RequiredJobTitle));

        if (!string.IsNullOrEmpty(searchDto.Country))
            query = query.Where(c => c.Country.Contains(searchDto.Country));

        if (searchDto.AssignedEmployeeId.HasValue)
            query = query.Where(c => c.AssignedEmployeeId == searchDto.AssignedEmployeeId);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToListAsync();

        var dtos = _mapper.Map<IEnumerable<CompanyAdminResponseDto>>(items);

        return new PagedResult<CompanyAdminResponseDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageNumber = searchDto.PageNumber,
            PageSize = searchDto.PageSize
        };
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
