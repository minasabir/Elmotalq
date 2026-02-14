using Elmtalq.BLL.Servicies.Abstraction;
using Elmtalq.BLL.DTOS.Admin;
using Elmtalq.DAL.Enums;
using Elmtalq.API.Helper;
using Microsoft.Extensions.Configuration;

namespace Elmtalq.API.Services;

public class ApiAuthService : IAuthService
{
    private readonly IAuthService _baseAuthService;
    private readonly IConfiguration _configuration;

    public ApiAuthService(IAuthService baseAuthService, IConfiguration configuration)
    {
        _baseAuthService = baseAuthService;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var result = await _baseAuthService.LoginAsync(dto);
        if (result == null) return null;

        // Override the token with proper JWT
        result.Token = JwtAuthenticationHelper.GenerateJwtToken(
            result.UserId, result.Email, result.Name, result.Role, _configuration);

        return result;
    }

    public string GenerateJwtToken(int userId, string email, string name, UserRole role)
    {
        return JwtAuthenticationHelper.GenerateJwtToken(userId, email, name, role, _configuration);
    }
}
