using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.Servicies.Abstraction;
using Elmtalq.BLL.Helper;

namespace Elmtalq.API.Controllers;

[ApiController]
[Route("api/Elmtalq")]
public class ElmtalqController : ControllerBase
{
    private readonly ICandidateService _candidateService;
    private readonly ICompanyService _companyService;
    private readonly ICompanyInfoService _companyInfoService;
    private readonly IValidator<CandidateCreateDto> _candidateValidator;
    private readonly IValidator<CompanyCreateDto> _companyValidator;

    public ElmtalqController(
        ICandidateService candidateService,
        ICompanyService companyService,
        ICompanyInfoService companyInfoService,
        IValidator<CandidateCreateDto> candidateValidator,
        IValidator<CompanyCreateDto> companyValidator)
    {
        _candidateService = candidateService;
        _companyService = companyService;
        _companyInfoService = companyInfoService;
        _candidateValidator = candidateValidator;
        _companyValidator = companyValidator;
    }

    [HttpGet("Health")]
    public IActionResult HealthCheck()
    {
        return Ok(new { 
            status = "Healthy", 
            timestamp = DateTime.UtcNow,
            version = "v1.0.0",
            message = "Elmtalq Recruitment API is running successfully"
        });
    }

    [HttpGet("Test")]
    public IActionResult TestEndpoint()
    {
        return Ok(new { 
            message = "API is working correctly!",
            timestamp = DateTime.UtcNow,
            endpoints = new[] {
                "GET /api/Elmtalq/Health",
                "GET /api/Elmtalq/Test",
                "POST /api/Elmtalq/Candidates",
                "POST /api/Elmtalq/Companies",
                "GET /api/Elmtalq/About",
                "GET /api/Elmtalq/Contact"
            }
        });
    }

    [HttpPost("Candidates")]
    public async Task<IActionResult> CreateCandidate([FromForm] CandidateCreateDto dto)
    {
        var validationResult = await _candidateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        try
        {
            var result = await _candidateService.CreateCandidateAsync(dto);
            return CreatedAtAction(nameof(CreateCandidate), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the candidate", error = ex.Message });
        }
    }

    [HttpPost("Companies")]
    public async Task<IActionResult> CreateCompany([FromBody] CompanyCreateDto dto)
    {
        var validationResult = await _companyValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return BadRequest(new { errors = validationResult.Errors.Select(e => e.ErrorMessage) });
        }

        try
        {
            var result = await _companyService.CreateCompanyAsync(dto);
            return CreatedAtAction(nameof(CreateCompany), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the company", error = ex.Message });
        }
    }

    [HttpGet("About")]
    public async Task<IActionResult> GetAbout()
    {
        try
        {
            var result = await _companyInfoService.GetAboutAsync();
            if (result == null)
            {
                return NotFound(new { message = "Company information not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving company information", error = ex.Message });
        }
    }

    [HttpGet("Contact")]
    public async Task<IActionResult> GetContact()
    {
        try
        {
            var result = await _companyInfoService.GetContactAsync();
            if (result == null)
            {
                return NotFound(new { message = "Contact information not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving contact information", error = ex.Message });
        }
    }
}
