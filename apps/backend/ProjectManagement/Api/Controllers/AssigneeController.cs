using Microsoft.AspNetCore.Mvc;
using ProjectManagement.Application.DTOs.Assignees;
using ProjectManagement.Application.Interfaces.Services;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace ProjectManagement.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AssigneeController : BaseController
{
  private readonly IAssigneeService _assigneeService;
  private readonly ILogger<AssigneeController> _logger;
  private readonly IFileUploadService _fileUploadService;

  public AssigneeController(
    IAssigneeService assigneeService,
    ILogger<AssigneeController> logger,
    IFileUploadService fileUploadService)
  {
    _assigneeService = assigneeService;
    _logger = logger;
    _fileUploadService = fileUploadService;
  }

  [HttpGet]
  public async Task<IActionResult> GetAssignees()
  {
    var userId = GetCurrentUserId();
    if (userId == null) return Unauthorized();

    var assignees = await _assigneeService.GetAllByUserIdAsync(userId);
    return Ok(assignees);
  }

  [HttpGet("{id:guid}")]
  public async Task<IActionResult> GetAssignee([FromRoute] Guid id)
  {
    var userId = GetCurrentUserId();
    if (userId == null) return Unauthorized();

    var assignee = await _assigneeService.GetByIdAsync(id, userId);
    return Ok(assignee);
  }

  [HttpPost]
  public async Task<IActionResult> CreateAssignee([FromForm] CreateAssigneeDto createAssigneeDto)
  {
    var userId = GetCurrentUserId();
    if (userId == null)
    {
      _logger.LogWarning("Unauthorized attempt to create assignee");
      return Unauthorized();
    }

    _logger.LogInformation("Creating assignee '{Name}' for user {UserId}",
      createAssigneeDto.Name, userId);

    string? avatarUrl = null;
    if (createAssigneeDto.AvatarFile != null)
    {
      _logger.LogInformation("Processing avatar upload for assignee creation");
      try
      {
        avatarUrl = await _fileUploadService.UploadAvatarAsync(
          createAssigneeDto.AvatarFile,
          Guid.NewGuid().ToString());
        _logger.LogInformation("Avatar uploaded successfully, URL: {AvatarUrl}", avatarUrl);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Avatar upload failed for assignee creation");
        return BadRequest($"Avatar upload failed: {ex.Message}");
      }
    }

    if (avatarUrl != null)
    {
      createAssigneeDto.AvatarUrl = avatarUrl;
    }

    var createdAssignee = await _assigneeService.CreateAsync(createAssigneeDto, userId);

    _logger.LogInformation("Created assignee {AssigneeId} with name '{Name}' for user {UserId}",
      createdAssignee.Id, createdAssignee.Name, userId);

    return CreatedAtAction(nameof(GetAssignee), new { id = createdAssignee.Id }, createdAssignee);
  }

  [HttpPut("{id:guid}")]
  public async Task<IActionResult> UpdateAssignee([FromRoute] Guid id, [FromForm] UpdateAssigneeDto updateAssigneeDto)
  {
    var userId = GetCurrentUserId();
    if (userId == null)
    {
      _logger.LogWarning("Unauthorized attempt to update assignee {AssigneeId}", id);
      return Unauthorized();
    }

    _logger.LogInformation("Updating assignee {AssigneeId} with name '{Name}' for user {UserId}",
      id, updateAssigneeDto.Name, userId);

    string? avatarUrl = null;
    if (updateAssigneeDto.AvatarFile != null)
    {
      _logger.LogInformation("Processing avatar upload for assignee update");
      try
      {
        avatarUrl = await _fileUploadService.UploadAvatarAsync(
          updateAssigneeDto.AvatarFile,
          id.ToString());
        _logger.LogInformation("Avatar uploaded successfully, URL: {AvatarUrl}", avatarUrl);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Avatar upload failed for assignee update");
        return BadRequest($"Avatar upload failed: {ex.Message}");
      }
    }

    if (avatarUrl != null)
    {
      updateAssigneeDto.AvatarUrl = avatarUrl;
    }

    var updatedAssignee = await _assigneeService.UpdateAsync(id, updateAssigneeDto, userId);

    _logger.LogInformation("Updated assignee {AssigneeId} successfully for user {UserId}", id, userId);

    return Ok(updatedAssignee);
  }

  [HttpDelete("{id:guid}")]
  public async Task<IActionResult> DeleteAssignee([FromRoute] Guid id)
  {
    var userId = GetCurrentUserId();
    if (userId == null)
    {
      _logger.LogWarning("Unauthorized attempt to delete assignee {AssigneeId}", id);
      return Unauthorized();
    }

    _logger.LogInformation("Deleting assignee {AssigneeId} for user {UserId}", id, userId);

    await _assigneeService.DeleteAsync(id, userId);

    _logger.LogInformation("Deleted assignee {AssigneeId} successfully for user {UserId}", id, userId);

    return NoContent();
  }
}
