using System.Reflection.Metadata;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.Extensions.Options;
using ProjectManagement.Application.Interfaces.Services;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ProjectManagement.Application.Services;

public class AzureBlobStorageService : IFileUploadService
{
  private readonly BlobServiceClient _blobServiceClient;
  private readonly string _containerName;
  private readonly ILogger<AzureBlobStorageService> _logger;
  private const long MaxFileSize = 5 * 1024 * 1024;
  private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

  public AzureBlobStorageService(
      IOptions<AzureStorageSettings> settings,
      ILogger<AzureBlobStorageService> logger)
  {
    _blobServiceClient = new BlobServiceClient(settings.Value.ConnectionString);
    _containerName = settings.Value.ContainerName;
    _logger = logger;

    _logger.LogInformation("AzureBlobStorageService initialized with container: {Container}", _containerName);
    CreateContainerIfNotExistsAsync().GetAwaiter().GetResult();
  }

  private async Task CreateContainerIfNotExistsAsync()
  {
    try
    {
      var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
      var response = await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

      if (response != null)
      {
        _logger.LogInformation("Created new container: {Container}", _containerName);
      }
      else
      {
        _logger.LogInformation("Container already exists: {Container}", _containerName);
      }
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to create/access container: {Container}", _containerName);
      throw;
    }
  }

  public async Task<string> UploadAvatarAsync(IFormFile avatarFile, string userId)
  {
    _logger.LogInformation("Starting avatar upload for user {UserId}, file: {FileName}, size: {Size} bytes",
        userId, avatarFile.FileName, avatarFile.Length);

    if (!IsValidImageFile(avatarFile))
    {
      _logger.LogWarning("Invalid file for user {UserId}: {FileName}", userId, avatarFile.FileName);
      throw new ArgumentException("Invalid file type. Only JPG, JPEG, PNG and WebP are allowed.");
    }

    var fileExtension = Path.GetExtension(avatarFile.FileName).ToLower();
    var blobName = $"{userId}/avatar_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";

    _logger.LogInformation("Generated blob name: {BlobName}", blobName);

    var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
    var blobClient = containerClient.GetBlobClient(blobName);

    var blobHttpHeaders = new BlobHttpHeaders
    {
      ContentType = avatarFile.ContentType
    };

    try
    {
      using (var stream = avatarFile.OpenReadStream())
      {
        var response = await blobClient.UploadAsync(stream, blobHttpHeaders);
        var avatarUrl = blobClient.Uri.ToString();

        _logger.LogInformation("Avatar uploaded successfully for user {UserId}: {Url}", userId, avatarUrl);
        return avatarUrl;
      }
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Avatar upload failed for user {UserId}, file: {FileName}", userId, avatarFile.FileName);
      throw;
    }
  }

  public async Task<bool> DeleteAvatarAsync(string avatarUrl)
  {
    try
    {
      var uri = new Uri(avatarUrl);
      var blobName = uri.Segments.Last();

      _logger.LogInformation("Deleting avatar: {BlobName}", blobName);

      var containerClient = _blobServiceClient.GetBlobContainerClient(_containerName);
      var blobClient = containerClient.GetBlobClient(blobName);

      var result = await blobClient.DeleteIfExistsAsync();

      if (result)
      {
        _logger.LogInformation("Avatar deleted successfully: {BlobName}", blobName);
      }
      else
      {
        _logger.LogWarning("Avatar not found for deletion: {BlobName}", blobName);
      }

      return result;
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to delete avatar: {Url}", avatarUrl);
      return false;
    }
  }

  public bool IsValidImageFile(IFormFile file)
  {
    if (file == null || file.Length == 0)
    {
      _logger.LogWarning("File validation failed: null or empty file");
      return false;
    }

    if (file.Length > MaxFileSize)
    {
      _logger.LogWarning("File validation failed: size {Size} exceeds max {MaxSize}", file.Length, MaxFileSize);
      return false;
    }

    var extension = Path.GetExtension(file.FileName).ToLower();
    var isValidExtension = _allowedExtensions.Contains(extension);

    if (!isValidExtension)
    {
      _logger.LogWarning("File validation failed: extension {Extension} not allowed", extension);
    }

    return isValidExtension;
  }
}