using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Application.DTOs.Columns;

public class UpdateColumnPositionDto
{
  [Required]
  public required Guid Id { get; set; }

  [Required]
  [Range(0, int.MaxValue)]
  public required int Position { get; set; }
}