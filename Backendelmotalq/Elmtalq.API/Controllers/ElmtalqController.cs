using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.Servicies.Abstraction;
using Elmtalq.BLL.Helper;
using Elmtalq.BLL.DTOS.Common;

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
    public ActionResult<ApiResponse<object>> HealthCheck()
    {
        var healthData = new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow,
            version = "v1.0.0"
        };

        return Ok(ApiResponse<object>.SuccessResponse(healthData, "Elmtalq Recruitment API is running successfully"));
    }

    [HttpGet("Test")]
    public ActionResult<ApiResponse<object>> TestEndpoint()
    {
        var testData = new
        {
            timestamp = DateTime.UtcNow,
            endpoints = new[]
            {
                "GET /api/Elmtalq/Health",
                "GET /api/Elmtalq/Test",
                "POST /api/Elmtalq/Candidates",
                "POST /api/Elmtalq/Companies",
                "GET /api/Elmtalq/About",
                "GET /api/Elmtalq/Contact"
            }
        };

        return Ok(ApiResponse<object>.SuccessResponse(testData, "API is working correctly!"));
    }

    [HttpPost("Candidates")]
    public async Task<ActionResult<ApiResponse<CandidateResponseDto>>> CreateCandidate([FromForm] CandidateCreateDto dto)
    {
        var validationResult = await _candidateValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray() as object);

            return BadRequest(ApiResponse<CandidateResponseDto>.Failure("Validation failed", errors));
        }

        var result = await _candidateService.CreateCandidateAsync(dto);

        var response = ApiResponse<CandidateResponseDto>.SuccessResponse(
            result,
            "Candidate created successfully");

        return CreatedAtAction(nameof(CreateCandidate), new { id = result.Id }, response);
    }

    [HttpPost("Companies")]
    public async Task<ActionResult<ApiResponse<CompanyResponseDto>>> CreateCompany([FromBody] CompanyCreateDto dto)
    {
        var validationResult = await _companyValidator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray() as object);

            return BadRequest(ApiResponse<CompanyResponseDto>.Failure("Validation failed", errors));
        }

        var result = await _companyService.CreateCompanyAsync(dto);

        var response = ApiResponse<CompanyResponseDto>.SuccessResponse(
            result,
            "Company request created successfully");

        return CreatedAtAction(nameof(CreateCompany), new { id = result.Id }, response);
    }

    [HttpGet("About")]
    public async Task<ActionResult<ApiResponse<AboutResponseDto>>> GetAbout()
    {
        var result = await _companyInfoService.GetAboutAsync();
        if (result == null)
        {
            return NotFound(ApiResponse<AboutResponseDto>.Failure("Company information not found"));
        }

        return Ok(ApiResponse<AboutResponseDto>.SuccessResponse(result, "Company information retrieved successfully"));
    }

    [HttpGet("Contact")]
    public async Task<ActionResult<ApiResponse<ContactResponseDto>>> GetContact()
    {
        var result = await _companyInfoService.GetContactAsync();
        if (result == null)
        {
            return NotFound(ApiResponse<ContactResponseDto>.Failure("Contact information not found"));
        }

        return Ok(ApiResponse<ContactResponseDto>.SuccessResponse(result, "Contact information retrieved successfully"));
    }
}
