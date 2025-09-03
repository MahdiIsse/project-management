namespace ProjectManagement.Application.Interfaces.Services;

public interface IFileUploadService
{
  Task<string> UploadAvatarAsync(IFormFile avatarFile, string userId);
  Task<bool> DeleteAvatarAsync(string avatarUrl);
  bool IsValidImageFile(IFormFile file);
}