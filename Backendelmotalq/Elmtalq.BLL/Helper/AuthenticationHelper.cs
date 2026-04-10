using Microsoft.Extensions.Configuration;
using Elmtalq.DAL.Enums;

namespace Elmtalq.BLL.Helper;

public static class AuthenticationHelper
{
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
