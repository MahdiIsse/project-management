using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProjectManagement.Application.DTOs.Auth;
using ProjectManagement.Application.Interfaces.Repositories;
using ProjectManagement.Application.Interfaces.Services;

namespace ProjectManagement.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : BaseController
{
  private readonly UserManager<IdentityUser> _userManager;
  private readonly RoleManager<IdentityRole> _roleManager;
  private readonly ITokenRepository _tokenRepository;
  private readonly IOnboardingService _onboardingService;
  private readonly IFileUploadService _fileUploadService;
  private readonly ILogger<AuthController> _logger;

  public AuthController(
    UserManager<IdentityUser> userManager,
    RoleManager<IdentityRole> roleManager,
    ITokenRepository tokenRepository,
    IOnboardingService onboardingService,
    IFileUploadService fileUploadService,
    ILogger<AuthController> logger)
  {
    _userManager = userManager;
    _roleManager = roleManager;
    _tokenRepository = tokenRepository;
    _onboardingService = onboardingService;
    _fileUploadService = fileUploadService;
    _logger = logger;
  }

  [HttpPost("register")]
  [AllowAnonymous]
  public async Task<IActionResult> Register([FromForm] RegisterRequestDto registerRequestDto)
  {
    _logger.LogInformation("Starting user registration for email: {Email}", registerRequestDto.Email);

    var user = new IdentityUser { UserName = registerRequestDto.Email, Email = registerRequestDto.Email };
    var result = await _userManager.CreateAsync(user, registerRequestDto.Password);

    if (!result.Succeeded)
    {
      _logger.LogWarning("User registration failed for email: {Email}. Errors: {Errors}",
        registerRequestDto.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
      return BadRequest(result.Errors);
    }

    _logger.LogInformation("User created successfully with ID: {UserId}", user.Id);

    string? avatarUrl = null;
    if (registerRequestDto.AvatarFile != null)
    {
      _logger.LogInformation("Processing avatar upload for user: {UserId}", user.Id);
      try
      {
        avatarUrl = await _fileUploadService.UploadAvatarAsync(
          registerRequestDto.AvatarFile,
          user.Id);
        _logger.LogInformation("Avatar uploaded successfully for user: {UserId}, URL: {AvatarUrl}", user.Id, avatarUrl);
      }
      catch (Exception ex)
      {
        _logger.LogError(ex, "Avatar upload failed for user: {UserId}. Deleting user account.", user.Id);
        await _userManager.DeleteAsync(user);
        return BadRequest($"Avatar upload failed: {ex.Message}");
      }
    }

    var claims = new List<Claim>
    {
      new Claim("FullName", registerRequestDto.FullName)
    };

    if (avatarUrl != null)
    {
      claims.Add(new Claim("AvatarUrl", avatarUrl));
    }

    await _userManager.AddClaimsAsync(user, claims);
    _logger.LogInformation("Claims added for user: {UserId}", user.Id);

    if (!await _roleManager.RoleExistsAsync("User"))
    {
      await _roleManager.CreateAsync(new IdentityRole("User"));
      _logger.LogInformation("Created 'User' role");
    }

    await _userManager.AddToRoleAsync(user, "User");
    _logger.LogInformation("User role assigned to user: {UserId}", user.Id);

    _logger.LogInformation("Starting onboarding process for user: {UserId}", user.Id);
    var (onboardingSuccess, onboardingError) = await _onboardingService.CreateInitialDataAsync(user.Id);

    if (onboardingSuccess)
    {
      _logger.LogInformation("Onboarding completed successfully for user: {UserId}", user.Id);
    }
    else
    {
      _logger.LogWarning("Onboarding failed for user: {UserId}. Error: {Error}", user.Id, onboardingError);
    }

    var roles = await _userManager.GetRolesAsync(user);
    var (token, expires) = await _tokenRepository.CreateTokenAsync(user, roles);

    var response = new RegisterResponseDto
    {
      Token = token,
      ExpiresAtUtc = expires,
      OnboardingCompleted = onboardingSuccess,
      OnboardingError = onboardingError,
      Message = onboardingSuccess
        ? "User registered and onboarded successfully"
        : $"User registered but onboarding failed: {onboardingError}"
    };

    _logger.LogInformation("User registration completed for user: {UserId}, onboarding success: {OnboardingSuccess}",
      user.Id, onboardingSuccess);

    return Ok(response);
  }

  [HttpPost("login")]
  [AllowAnonymous]
  public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
  {
    _logger.LogInformation("Login attempt for email: {Email}", loginRequestDto.Email);

    var user = await _userManager.FindByEmailAsync(loginRequestDto.Email) ?? await _userManager.FindByNameAsync(loginRequestDto.Email);

    if (user == null)
    {
      _logger.LogWarning("Login failed - user not found for email: {Email}", loginRequestDto.Email);
      return Unauthorized("Invalid credentials");
    }

    var passwordValid = await _userManager.CheckPasswordAsync(user, loginRequestDto.Password);
    if (!passwordValid)
    {
      _logger.LogWarning("Login failed - invalid password for user: {UserId}", user.Id);
      return Unauthorized("Invalid credentials");
    }

    var roles = await _userManager.GetRolesAsync(user);
    var (token, expires) = await _tokenRepository.CreateTokenAsync(user, roles);

    _logger.LogInformation("Login successful for user: {UserId}", user.Id);

    return Ok(new LoginResponseDto { Token = token, ExpiresAtUtc = expires });
  }

  [HttpGet("me")]
  [Authorize]
  public async Task<IActionResult> GetCurrentUser()
  {
    _logger.LogInformation("Getting current user details");

    var userId = GetCurrentUserId();
    if (string.IsNullOrEmpty(userId))
    {
      _logger.LogWarning("No user ID found in token");
      return Unauthorized("Invalid token");
    }

    _logger.LogInformation("Fetching details for user: {UserId}", userId);

    var user = await _userManager.FindByIdAsync(userId);
    if (user == null)
    {
      _logger.LogWarning("User not found: {UserId}", userId);
      return NotFound("User not found");
    }

    var claims = await _userManager.GetClaimsAsync(user);
    var fullName = claims.FirstOrDefault(c => c.Type == "FullName")?.Value;
    var avatarUrl = claims.FirstOrDefault(c => c.Type == "AvatarUrl")?.Value;

    var roles = await _userManager.GetRolesAsync(user);

    _logger.LogInformation("Successfully retrieved user details for: {UserId}", userId);

    var userDto = new UserDto
    {
      Id = user.Id,
      Email = user.Email!,
      FullName = fullName,
      AvatarUrl = avatarUrl,
      Roles = roles
    };

    return Ok(userDto);
  }
}