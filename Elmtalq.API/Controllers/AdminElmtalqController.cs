using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.BLL.Servicies.Abstraction;
using Elmtalq.BLL.Helper;
using Microsoft.AspNetCore.Authorization;

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
    public IActionResult HealthCheck()
    {
        return Ok(new { 
            status = "Healthy", 
            timestamp = DateTime.UtcNow,
            version = "v1.0.0",
            message = "Elmtalq Recruitment Admin API is running successfully"
        });
    }

    [HttpPost("Auth/Login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var validationResult = await _loginValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        try
        {
            var result = await _authService.LoginAsync(dto);
            if (result == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
        }
    }

    [HttpPost("Employees")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> CreateEmployee([FromBody] EmployeeCreateDto dto)
    {
        var validationResult = await _employeeCreateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        try
        {
            var existingEmail = await _employeeService.EmailExistsAsync(dto.Email);
            if (existingEmail)
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var result = await _employeeService.CreateEmployeeAsync(dto);
            return CreatedAtAction(nameof(CreateEmployee), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the employee", error = ex.Message });
        }
    }

    [HttpPatch("Employees/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> PatchEmployee(int id, [FromBody] EmployeePatchDto dto)
    {
        try
        {
            var result = await _employeeService.PatchEmployeeAsync(id, dto);
            if (result == null)
            {
                return NotFound(new { message = "Employee not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the employee", error = ex.Message });
        }
    }

    [HttpGet("Employees")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetAllEmployees()
    {
        try
        {
            var result = await _employeeService.GetAllEmployeesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving employees", error = ex.Message });
        }
    }

    [HttpGet("Candidates")]
    [Authorize]
    public async Task<IActionResult> GetAllCandidates()
    {
        try
        {
            var result = await _candidateAdminService.GetAllCandidatesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving candidates", error = ex.Message });
        }
    }

    [HttpGet("Candidates/Unassigned")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetUnassignedCandidates()
    {
        try
        {
            var result = await _candidateAdminService.GetUnassignedCandidatesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving unassigned candidates", error = ex.Message });
        }
    }

    [HttpGet("Candidates/{id}")]
    [Authorize]
    public async Task<IActionResult> GetCandidateById(int id)
    {
        try
        {
            var result = await _candidateAdminService.GetCandidateByIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = "Candidate not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the candidate", error = ex.Message });
        }
    }

    [HttpPut("Candidates/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateCandidate(int id, [FromBody] CandidateUpdateDto dto)
    {
        var validationResult = await _candidateUpdateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        try
        {
            var result = await _candidateAdminService.UpdateCandidateAsync(id, dto);
            if (result == null)
            {
                return NotFound(new { message = "Candidate not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the candidate", error = ex.Message });
        }
    }

    [HttpPatch("Candidates/{id}")]
    [Authorize]
    public async Task<IActionResult> PatchCandidate(int id, [FromBody] CandidatePatchDto dto)
    {
        try
        {
            var result = await _candidateAdminService.PatchCandidateAsync(id, dto);
            if (result == null)
            {
                return NotFound(new { message = "Candidate not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the candidate", error = ex.Message });
        }
    }

    [HttpDelete("Candidates/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> DeleteCandidate(int id)
    {
        try
        {
            await _candidateAdminService.DeleteCandidateAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the candidate", error = ex.Message });
        }
    }

    [HttpPut("Candidates/{id}/Assign/{secretaryId}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> AssignCandidateToEmployee(int id, int secretaryId)
    {
        try
        {
            var result = await _candidateAdminService.AssignCandidateToEmployeeAsync(id, secretaryId);
            if (!result)
            {
                return BadRequest(new { message = "Failed to assign candidate. Please check if candidate and employee exist." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while assigning the candidate", error = ex.Message });
        }
    }

    [HttpGet("Companies")]
    [Authorize]
    public async Task<IActionResult> GetAllCompanies()
    {
        try
        {
            var result = await _companyAdminService.GetAllCompaniesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving companies", error = ex.Message });
        }
    }

    [HttpGet("Companies/Unassigned")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> GetUnassignedCompanies()
    {
        try
        {
            var result = await _companyAdminService.GetUnassignedCompaniesAsync();
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving unassigned companies", error = ex.Message });
        }
    }

    [HttpGet("Companies/{id}")]
    [Authorize]
    public async Task<IActionResult> GetCompanyById(int id)
    {
        try
        {
            var result = await _companyAdminService.GetCompanyByIdAsync(id);
            if (result == null)
            {
                return NotFound(new { message = "Company not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the company", error = ex.Message });
        }
    }

    [HttpPut("Companies/{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateCompany(int id, [FromBody] CompanyUpdateDto dto)
    {
        var validationResult = await _companyUpdateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        try
        {
            var result = await _companyAdminService.UpdateCompanyAsync(id, dto);
            if (result == null)
            {
                return NotFound(new { message = "Company not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the company", error = ex.Message });
        }
    }

    [HttpPatch("Companies/{id}")]
    [Authorize]
    public async Task<IActionResult> PatchCompany(int id, [FromBody] CompanyPatchDto dto)
    {
        try
        {
            var result = await _companyAdminService.PatchCompanyAsync(id, dto);
            if (result == null)
            {
                return NotFound(new { message = "Company not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the company", error = ex.Message });
        }
    }

    [HttpDelete("Companies/{id}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        try
        {
            await _companyAdminService.DeleteCompanyAsync(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the company", error = ex.Message });
        }
    }

    [HttpPut("Companies/{id}/Assign/{secretaryId}")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> AssignCompanyToEmployee(int id, int secretaryId)
    {
        try
        {
            var result = await _companyAdminService.AssignCompanyToEmployeeAsync(id, secretaryId);
            if (!result)
            {
                return BadRequest(new { message = "Failed to assign company. Please check if company and employee exist." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while assigning the company", error = ex.Message });
        }
    }

    [HttpGet("Search")]
    [Authorize]
    public async Task<IActionResult> Search([FromQuery] CandidateSearchDto? candidateSearch, [FromQuery] CompanySearchDto? companySearch)
    {
        try
        {
            var candidates = candidateSearch != null ? 
                await _candidateAdminService.SearchCandidatesAsync(candidateSearch) : 
                new List<CandidateAdminResponseDto>();

            var companies = companySearch != null ? 
                await _companyAdminService.SearchCompaniesAsync(companySearch) : 
                new List<CompanyAdminResponseDto>();

            return Ok(new { Candidates = candidates, Companies = companies });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred during search", error = ex.Message });
        }
    }

    [HttpPatch("About")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> PatchAbout([FromBody] AboutPatchDto dto)
    {
        try
        {
            var result = await _companyInfoService.UpdateAboutAsync(dto);
            if (result == null)
            {
                return BadRequest(new { message = "Failed to update company information" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating company information", error = ex.Message });
        }
    }

    [HttpPatch("Contact")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> PatchContact([FromBody] AboutPatchDto dto)
    {
        try
        {
            var result = await _companyInfoService.UpdateContactAsync(dto);
            if (result == null)
            {
                return BadRequest(new { message = "Failed to update contact information" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating contact information", error = ex.Message });
        }
    }
}
