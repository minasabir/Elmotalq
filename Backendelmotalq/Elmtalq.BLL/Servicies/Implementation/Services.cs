using AutoMapper;
using Elmtalq.DAL.Entities;
using Elmtalq.DAL.Repo.Abstraction;
using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.BLL.Helper;
using Elmtalq.DAL.Enums;
using Elmtalq.BLL.Servicies.Abstraction;
using Microsoft.Extensions.Configuration;

namespace Elmtalq.BLL.Servicies.Implementation;

// Public Website Services
public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly IMapper _mapper;
    private readonly FileHelper _fileHelper;

    public CandidateService(ICandidateRepository candidateRepository, IMapper mapper, FileHelper fileHelper)
    {
        _candidateRepository = candidateRepository;
        _mapper = mapper;
        _fileHelper = fileHelper;
    }

    public async Task<CandidateResponseDto> CreateCandidateAsync(CandidateCreateDto dto)
    {
        var candidate = _mapper.Map<Candidate>(dto);

        // Handle file uploads
        if (dto.CVFile != null)
            candidate.CVFilePath = await _fileHelper.SaveFileAsync(dto.CVFile, "cv");

        if (dto.PersonalPhotoFile != null)
            candidate.PersonalPhotoFilePath = await _fileHelper.SaveFileAsync(dto.PersonalPhotoFile, "photos");

        if (dto.IntroductionVideoFile != null)
            candidate.IntroductionVideoFilePath = await _fileHelper.SaveFileAsync(dto.IntroductionVideoFile, "videos");

        var createdCandidate = await _candidateRepository.AddAsync(candidate);
        return _mapper.Map<CandidateResponseDto>(createdCandidate);
    }
}

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IMapper _mapper;

    public CompanyService(ICompanyRepository companyRepository, IMapper mapper)
    {
        _companyRepository = companyRepository;
        _mapper = mapper;
    }

    public async Task<CompanyResponseDto> CreateCompanyAsync(CompanyCreateDto dto)
    {
        var company = _mapper.Map<Company>(dto);
        var createdCompany = await _companyRepository.AddAsync(company);
        return _mapper.Map<CompanyResponseDto>(createdCompany);
    }
}

public class CompanyInfoService : ICompanyInfoService
{
    private readonly ICompanyInfoRepository _companyInfoRepository;
    private readonly IMapper _mapper;

    public CompanyInfoService(ICompanyInfoRepository companyInfoRepository, IMapper mapper)
    {
        _companyInfoRepository = companyInfoRepository;
        _mapper = mapper;
    }

    public async Task<AboutResponseDto?> GetAboutAsync()
    {
        var companyInfo = await _companyInfoRepository.GetFirstAsync();
        return companyInfo != null ? _mapper.Map<AboutResponseDto>(companyInfo) : null;
    }

    public async Task<ContactResponseDto?> GetContactAsync()
    {
        var companyInfo = await _companyInfoRepository.GetFirstAsync();
        return companyInfo != null ? _mapper.Map<ContactResponseDto>(companyInfo) : null;
    }

    public async Task<AboutResponseDto?> UpdateAboutAsync(AboutPatchDto dto)
    {
        var companyInfo = await _companyInfoRepository.GetFirstAsync();
        if (companyInfo == null)
        {
            // Create new if doesn't exist
            companyInfo = new Elmtalq.DAL.Entities.CompanyInfo();
        }

        if (!string.IsNullOrEmpty(dto.CompanyDescription))
            companyInfo.CompanyDescription = dto.CompanyDescription;
        
        if (!string.IsNullOrEmpty(dto.OfficeLocation))
            companyInfo.OfficeLocation = dto.OfficeLocation;

        if (companyInfo.Id == 0)
            await _companyInfoRepository.AddAsync(companyInfo);
        else
            await _companyInfoRepository.UpdateAsync(companyInfo);

        return _mapper.Map<AboutResponseDto>(companyInfo);
    }

    public async Task<ContactResponseDto?> UpdateContactAsync(AboutPatchDto dto)
    {
        var companyInfo = await _companyInfoRepository.GetFirstAsync();
        if (companyInfo == null)
        {
            // Create new if doesn't exist
            companyInfo = new Elmtalq.DAL.Entities.CompanyInfo();
        }

        if (!string.IsNullOrEmpty(dto.Facebook))
            companyInfo.Facebook = dto.Facebook;
        
        if (!string.IsNullOrEmpty(dto.Instagram))
            companyInfo.Instagram = dto.Instagram;
        
        if (!string.IsNullOrEmpty(dto.WhatsApp))
            companyInfo.WhatsApp = dto.WhatsApp;
        
        if (!string.IsNullOrEmpty(dto.LinkedIn))
            companyInfo.LinkedIn = dto.LinkedIn;
        
        if (!string.IsNullOrEmpty(dto.ContactEmail))
            companyInfo.ContactEmail = dto.ContactEmail;
        
        if (!string.IsNullOrEmpty(dto.ContactPhone))
            companyInfo.ContactPhone = dto.ContactPhone;

        if (companyInfo.Id == 0)
            await _companyInfoRepository.AddAsync(companyInfo);
        else
            await _companyInfoRepository.UpdateAsync(companyInfo);

        return _mapper.Map<ContactResponseDto>(companyInfo);
    }
}

// Admin Dashboard Services
public class AuthService : IAuthService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IEmployeeRepository employeeRepository, IConfiguration configuration)
    {
        _employeeRepository = employeeRepository;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var employee = await _employeeRepository.GetByEmailAsync(dto.Email);
        if (employee == null || !AuthenticationHelper.VerifyPassword(dto.Password, employee.PasswordHash))
            return null;

        var token = GenerateJwtToken(employee.Id, employee.Email, employee.Name, employee.Role);

        return new LoginResponseDto
        {
            Token = token,
            UserId = employee.Id,
            Name = employee.Name,
            Email = employee.Email,
            Role = employee.Role
        };
    }

    public string GenerateJwtToken(int userId, string email, string name, UserRole role)
    {
        // This will be implemented in the API layer with proper JWT configuration
        // For now, return a placeholder that will be overridden in API
        return "jwt_token_placeholder";
    }

    // New method for API layer to override
    public string GenerateJwtTokenWithConfig(int userId, string email, string name, UserRole role, IConfiguration configuration)
    {
        // This will be implemented in the API layer
        throw new NotImplementedException("JWT generation should be handled in API layer");
    }
}

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public EmployeeService(IEmployeeRepository employeeRepository, IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<EmployeeResponseDto> CreateEmployeeAsync(EmployeeCreateDto dto)
    {
        var employee = _mapper.Map<Employee>(dto);
        employee.PasswordHash = AuthenticationHelper.HashPassword(dto.Password);

        var createdEmployee = await _employeeRepository.AddAsync(employee);
        return _mapper.Map<EmployeeResponseDto>(createdEmployee);
    }

    public async Task<EmployeeResponseDto?> GetEmployeeByIdAsync(int id)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        return employee != null ? _mapper.Map<EmployeeResponseDto>(employee) : null;
    }

    public async Task<IEnumerable<EmployeeResponseDto>> GetAllEmployeesAsync()
    {
        var employees = await _employeeRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<EmployeeResponseDto>>(employees);
    }

    public async Task<EmployeeResponseDto?> UpdateEmployeeAsync(int id, EmployeeUpdateDto dto)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null) return null;

        _mapper.Map(dto, employee);
        await _employeeRepository.UpdateAsync(employee);

        return _mapper.Map<EmployeeResponseDto>(employee);
    }

    public async Task<bool> DeleteEmployeeAsync(int id)
    {
        await _employeeRepository.DeleteAsync(id);
        return true;
    }

    public async Task<EmployeeResponseDto?> PatchEmployeeAsync(int id, EmployeePatchDto dto)
    {
        var employee = await _employeeRepository.GetByIdAsync(id);
        if (employee == null) return null;

        // Apply only non-null values
        if (!string.IsNullOrEmpty(dto.Name))
            employee.Name = dto.Name;
        
        if (!string.IsNullOrEmpty(dto.Email))
            employee.Email = dto.Email;
        
        if (dto.Role.HasValue)
            employee.Role = dto.Role.Value;
        
        if (dto.Salary.HasValue)
            employee.Salary = dto.Salary.Value;
        
        if (dto.IsActive.HasValue)
            employee.IsActive = dto.IsActive.Value;

        await _employeeRepository.UpdateAsync(employee);
        return _mapper.Map<EmployeeResponseDto>(employee);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _employeeRepository.EmailExistsAsync(email);
    }
}
