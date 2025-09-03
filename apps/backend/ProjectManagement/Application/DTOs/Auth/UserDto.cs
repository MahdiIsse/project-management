namespace ProjectManagement.Application.DTOs.Auth;

public class UserDto
{
  public required string Id { get; set; }
  public required string Email { get; set; }
  public string? FullName { get; set; }
  public string? AvatarUrl { get; set; }
  public DateTime CreatedAt { get; set; }
  public IList<string> Roles { get; set; } = new List<string>();

}