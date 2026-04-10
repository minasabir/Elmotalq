using Microsoft.AspNetCore.Http;

namespace Elmtalq.BLL.Helper;

public class FileHelper
{
    private readonly string _uploadsFolder;

    public FileHelper(string uploadsFolder)
    {
        _uploadsFolder = uploadsFolder;
        Directory.CreateDirectory(_uploadsFolder);
    }

    public async Task<string> SaveFileAsync(IFormFile file, string folderName)
    {
        if (file == null || file.Length == 0)
            return string.Empty;

        var folderPath = Path.Combine(_uploadsFolder, folderName);
        Directory.CreateDirectory(folderPath);

        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folderPath, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return Path.Combine(folderName, uniqueFileName).Replace("\\", "/");
    }

    public void DeleteFile(string? filePath)
    {
        if (string.IsNullOrEmpty(filePath))
            return;

        var fullPath = Path.Combine(_uploadsFolder, filePath.Replace("/", "\\"));
        
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }
    }

    public string GetContentType(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLowerInvariant();
        return extension switch
        {
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".jpg" => "image/jpeg",
            ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".mp4" => "video/mp4",
            ".avi" => "video/avi",
            ".mov" => "video/quicktime",
            _ => "application/octet-stream"
        };
    }
}
