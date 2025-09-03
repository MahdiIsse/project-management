using System.ComponentModel.DataAnnotations;

namespace ProjectManagement.Application.DTOs.Auth;

public class RegisterRequestDto
{
  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Please enter a valid email address")]
  public required string Email { get; set; }

  [Required(ErrorMessage = "Password is required")]
  [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
  public required string Password { get; set; }

  [Required(ErrorMessage = "Full name is required")]
  [StringLength(100, MinimumLength = 2, ErrorMessage = "Full name must be at least 2 characters")]
  public required string FullName { get; set; }

  public IFormFile? AvatarFile { get; set; }
}