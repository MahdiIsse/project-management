using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Application.DTOs.ProjectTasks;

public class UpdateTaskPositionDto
{
  [Required]
  public required Guid Id { get; set; }

  [Required]
  [Range(0, int.MaxValue)]
  public required int Position { get; set; }

  [Required]
  public required Guid ColumnId { get; set; }
}