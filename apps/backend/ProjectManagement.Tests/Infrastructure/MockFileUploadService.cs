using Microsoft.AspNetCore.Http;
using ProjectManagement.Application.Interfaces.Services;

namespace ProjectManagement.Tests.Infrastructure;

public class MockFileUploadService : IFileUploadService
{
  public Task<string> UploadAvatarAsync(IFormFile avatarFile, string userId)
  {
    return Task.FromResult($"https://test-storage.com/avatars/{userId}.jpg");
  }

  public Task<bool> DeleteAvatarAsync(string avatarUrl)
  {
    return Task.FromResult(true);
  }

  public bool IsValidImageFile(IFormFile file)
  {
    return true;
  }
}
