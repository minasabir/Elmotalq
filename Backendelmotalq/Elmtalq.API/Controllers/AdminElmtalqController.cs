using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.BLL.Servicies.Abstraction;
using Elmtalq.BLL.Helper;
using Microsoft.AspNetCore.Authorization;
using Elmtalq.BLL.DTOS.Common;
using Elmtalq.BLL.DTOS.Public;

namespace Elmtalq.API.Controllers;

[ApiController]
[Route("api/AdminElmtalq")]
public class AdminElmtalqController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IEmployeeService _employeeService;
    private readonly ICandidateAdminService _candidateAdminService;
    private readonly ICompanyAdminService _companyAdminService;
    private readonly ICompanyInfoService _companyInfoService;
    private readonly IValidator<LoginRequestDto> _loginValidator;
    private readonly IValidator<EmployeeCreateDto> _employeeCreateValidator;
    private readonly IValidator<EmployeeUpdateDto> _employeeUpdateValidator;
    private readonly IValidator<CandidateUpdateDto> _candidateUpdateValidator;
    private readonly IValidator<CompanyUpdateDto> _companyUpdateValidator;

    public AdminElmtalqController(
        IAuthService authService,
        IEmployeeService employeeService,
        ICandidateAdminService candidateAdminService,
        ICompanyAdminService companyAdminService,
        ICompanyInfoService companyInfoService,
        IValidator<LoginRequestDto> loginValidator,
        IValidator<EmployeeCreateDto> employeeCreateValidator,
        IValidator<EmployeeUpdateDto> employeeUpdateValidator,
        IValidator<CandidateUpdateDto> candidateUpdateValidator,
        IValidator<CompanyUpdateDto> companyUpdateValidator)
    {
        _authService = authService;
        _employeeService = employeeService;
        _candidateAdminService = candidateAdminService;
        _companyAdminService = companyAdminService;
        _companyInfoService = companyInfoService;
        _loginValidator = loginValidator;
        _employeeCreateValidator = employeeCreateValidator;
        _employeeUpdateValidator = employeeUpdateValidator;
        _candidateUpdateValidator = candidateUpdateValidator;
        _companyUpdateValidator = companyUpdateValidator;
    }

    [HttpGet("Health")]
    public ActionResult<ApiResponse<object>> HealthCheck()
    {
        var healthData = new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow,
            version = "v1.0.0"
        };

        return Ok(ApiResponse<object>.SuccessResponse(healthData, "Elmtalq Recruitment Admin API is running successfully"));
    }

    [HttpPost("Auth/Login")]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto dto)
    {
        var validationResult = await _loginValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray() as object);

            return BadRequest(ApiResponse<LoginResponseDto>.Failure("Validation failed", errors));
        }

        var result = await _authService.LoginAsync(dto);
        if (result == null)
        {
            return Unauthorized(ApiResponse<LoginResponseDto>.Failure("Invalid email or password"));
        }

        return Ok(ApiResponse<LoginResponseDto>.SuccessResponse(result, "Login successful"));
    }

    [HttpPost("Employees")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<EmployeeResponseDto>>> CreateEmployee([FromBody] EmployeeCreateDto dto)
    {
        var validationResult = await _employeeCreateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray() as object);

            return BadRequest(ApiResponse<EmployeeResponseDto>.Failure("Validation failed", errors));
        }

        var existingEmail = await _employeeService.EmailExistsAsync(dto.Email);
        if (existingEmail)
        {
            return BadRequest(ApiResponse<EmployeeResponseDto>.Failure("Email already exists"));
        }

        var result = await _employeeService.CreateEmployeeAsync(dto);

        var response = ApiResponse<EmployeeResponseDto>.SuccessResponse(
            result,
            "Employee created successfully");

        return CreatedAtAction(nameof(CreateEmployee), new { id = result.Id }, response);
    }

    [HttpPatch("Employees/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<EmployeeResponseDto>>> PatchEmployee(int id, [FromBody] EmployeePatchDto dto)
    {
        var result = await _employeeService.PatchEmployeeAsync(id, dto);
        if (result == null)
        {
            return NotFound(ApiResponse<EmployeeResponseDto>.Failure("Employee not found"));
        }

        return Ok(ApiResponse<EmployeeResponseDto>.SuccessResponse(result, "Employee updated successfully"));
    }

    [HttpGet("Employees")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<IEnumerable<EmployeeResponseDto>>>> GetAllEmployees()
    {
        var result = await _employeeService.GetAllEmployeesAsync();
        return Ok(ApiResponse<IEnumerable<EmployeeResponseDto>>.SuccessResponse(result, "Employees retrieved successfully"));
    }

    [HttpGet("Candidates")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<PagedResult<CandidateAdminResponseDto>>>> GetAllCandidates([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _candidateAdminService.GetAllCandidatesAsync(page, pageSize);
        return Ok(ApiResponse<PagedResult<CandidateAdminResponseDto>>.SuccessResponse(result, "Candidates retrieved successfully"));
    }

    [HttpGet("Candidates/Unassigned")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CandidateAdminResponseDto>>>> GetUnassignedCandidates()
    {
        var result = await _candidateAdminService.GetUnassignedCandidatesAsync();
        return Ok(ApiResponse<IEnumerable<CandidateAdminResponseDto>>.SuccessResponse(result, "Unassigned candidates retrieved successfully"));
    }

    [HttpGet("Candidates/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CandidateAdminResponseDto>>> GetCandidateById(int id)
    {
        var result = await _candidateAdminService.GetCandidateByIdAsync(id);
        if (result == null)
        {
            return NotFound(ApiResponse<CandidateAdminResponseDto>.Failure("Candidate not found"));
        }

        return Ok(ApiResponse<CandidateAdminResponseDto>.SuccessResponse(result, "Candidate retrieved successfully"));
    }

    [HttpPut("Candidates/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CandidateAdminResponseDto>>> UpdateCandidate(int id, [FromBody] CandidateUpdateDto dto)
    {
        var validationResult = await _candidateUpdateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray() as object);

            return BadRequest(ApiResponse<CandidateAdminResponseDto>.Failure("Validation failed", errors));
        }

        var result = await _candidateAdminService.UpdateCandidateAsync(id, dto);
        if (result == null)
        {
            return NotFound(ApiResponse<CandidateAdminResponseDto>.Failure("Candidate not found"));
        }

        return Ok(ApiResponse<CandidateAdminResponseDto>.SuccessResponse(result, "Candidate updated successfully"));
    }

    [HttpPatch("Candidates/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CandidateAdminResponseDto>>> PatchCandidate(int id, [FromBody] CandidatePatchDto dto)
    {
        var result = await _candidateAdminService.PatchCandidateAsync(id, dto);
        if (result == null)
        {
            return NotFound(ApiResponse<CandidateAdminResponseDto>.Failure("Candidate not found"));
        }

        return Ok(ApiResponse<CandidateAdminResponseDto>.SuccessResponse(result, "Candidate updated successfully"));
    }

    [HttpDelete("Candidates/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> DeleteCandidate(int id)
    {
        await _candidateAdminService.DeleteCandidateAsync(id);
        return NoContent();
    }

    [HttpPut("Candidates/{id}/Assign/{secretaryId}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<object>>> AssignCandidateToEmployee(int id, int secretaryId)
    {
        var result = await _candidateAdminService.AssignCandidateToEmployeeAsync(id, secretaryId);
        if (!result)
        {
            return BadRequest(ApiResponse<object>.Failure("Failed to assign candidate. Please check if candidate and employee exist."));
        }

        return Ok(ApiResponse<object>.SuccessResponse(new { CandidateId = id, SecretaryId = secretaryId }, "Candidate assigned successfully"));
    }

    [HttpGet("Companies")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<PagedResult<CompanyAdminResponseDto>>>> GetAllCompanies([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await _companyAdminService.GetAllCompaniesAsync(page, pageSize);
        return Ok(ApiResponse<PagedResult<CompanyAdminResponseDto>>.SuccessResponse(result, "Companies retrieved successfully"));
    }

    [HttpGet("Companies/Unassigned")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CompanyAdminResponseDto>>>> GetUnassignedCompanies()
    {
        var result = await _companyAdminService.GetUnassignedCompaniesAsync();
        return Ok(ApiResponse<IEnumerable<CompanyAdminResponseDto>>.SuccessResponse(result, "Unassigned companies retrieved successfully"));
    }

    [HttpGet("Companies/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CompanyAdminResponseDto>>> GetCompanyById(int id)
    {
        var result = await _companyAdminService.GetCompanyByIdAsync(id);
        if (result == null)
        {
            return NotFound(ApiResponse<CompanyAdminResponseDto>.Failure("Company not found"));
        }

        return Ok(ApiResponse<CompanyAdminResponseDto>.SuccessResponse(result, "Company retrieved successfully"));
    }

    [HttpPut("Companies/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CompanyAdminResponseDto>>> UpdateCompany(int id, [FromBody] CompanyUpdateDto dto)
    {
        var validationResult = await _companyUpdateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray() as object);

            return BadRequest(ApiResponse<CompanyAdminResponseDto>.Failure("Validation failed", errors));
        }

        var result = await _companyAdminService.UpdateCompanyAsync(id, dto);
        if (result == null)
        {
            return NotFound(ApiResponse<CompanyAdminResponseDto>.Failure("Company not found"));
        }

        return Ok(ApiResponse<CompanyAdminResponseDto>.SuccessResponse(result, "Company updated successfully"));
    }

    [HttpPatch("Companies/{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CompanyAdminResponseDto>>> PatchCompany(int id, [FromBody] CompanyPatchDto dto)
    {
        var result = await _companyAdminService.PatchCompanyAsync(id, dto);
        if (result == null)
        {
            return NotFound(ApiResponse<CompanyAdminResponseDto>.Failure("Company not found"));
        }

        return Ok(ApiResponse<CompanyAdminResponseDto>.SuccessResponse(result, "Company updated successfully"));
    }

    [HttpDelete("Companies/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        await _companyAdminService.DeleteCompanyAsync(id);
        return NoContent();
    }

    [HttpPut("Companies/{id}/Assign/{secretaryId}")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<object>>> AssignCompanyToEmployee(int id, int secretaryId)
    {
        var result = await _companyAdminService.AssignCompanyToEmployeeAsync(id, secretaryId);
        if (!result)
        {
            return BadRequest(ApiResponse<object>.Failure("Failed to assign company. Please check if company and employee exist."));
        }

        return Ok(ApiResponse<object>.SuccessResponse(new { CompanyId = id, SecretaryId = secretaryId }, "Company assigned successfully"));
    }

    [HttpGet("Search")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<object>>> Search([FromQuery] CandidateSearchDto? candidateSearch, [FromQuery] CompanySearchDto? companySearch)
    {
        object candidates = new List<CandidateAdminResponseDto>();
        object companies = new List<CompanyAdminResponseDto>();

        if (candidateSearch != null)
        {
            // Ensure defaults
            if (candidateSearch.PageNumber < 1) candidateSearch.PageNumber = 1;
            if (candidateSearch.PageSize < 1) candidateSearch.PageSize = 10;

            // Only search if at least one filter is provided or if pagination is explicit
            // We'll trust the frontend sends what it needs
            candidates = await _candidateAdminService.SearchCandidatesAsync(candidateSearch);
        }

        if (companySearch != null)
        {
            if (companySearch.PageNumber < 1) companySearch.PageNumber = 1;
            if (companySearch.PageSize < 1) companySearch.PageSize = 10;

            companies = await _companyAdminService.SearchCompaniesAsync(companySearch);
        }

        var data = new { Candidates = candidates, Companies = companies };
        return Ok(ApiResponse<object>.SuccessResponse(data, "Search completed successfully"));
    }

    [HttpPatch("About")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<AboutResponseDto>>> PatchAbout([FromBody] AboutPatchDto dto)
    {
        var result = await _companyInfoService.UpdateAboutAsync(dto);
        if (result == null)
        {
            return BadRequest(ApiResponse<AboutResponseDto>.Failure("Failed to update company information"));
        }

        return Ok(ApiResponse<AboutResponseDto>.SuccessResponse(result, "Company information updated successfully"));
    }

    [HttpPatch("Contact")]
    [Authorize(Roles = "Owner")]
    public async Task<ActionResult<ApiResponse<ContactResponseDto>>> PatchContact([FromBody] AboutPatchDto dto)
    {
        var result = await _companyInfoService.UpdateContactAsync(dto);
        if (result == null)
        {
            return BadRequest(ApiResponse<ContactResponseDto>.Failure("Failed to update contact information"));
        }

        return Ok(ApiResponse<ContactResponseDto>.SuccessResponse(result, "Contact information updated successfully"));
    }
}
