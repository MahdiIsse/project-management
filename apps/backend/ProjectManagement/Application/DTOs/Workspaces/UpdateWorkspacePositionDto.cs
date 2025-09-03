using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Application.DTOs.Workspaces;

public class UpdateWorkspacePositionDto
{
  [Required]
  public required Guid Id { get; set; }

  [Required]
  [Range(0, int.MaxValue)]
  public required int Position { get; set; }
}