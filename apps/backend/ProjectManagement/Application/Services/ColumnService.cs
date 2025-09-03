using AutoMapper;
using ProjectManagement.Infrastructure.Exceptions;
using ProjectManagement.Domain;
using ProjectManagement.Application.DTOs.Columns;
using ProjectManagement.Application.Interfaces.Repositories;
using ProjectManagement.Application.Interfaces.Services;
using ProjectManagement.Application.DTOs;


namespace ProjectManagement.Application.Services;

public class ColumnService : IColumnService
{
  private readonly IColumnRepository _columnRepository;
  private readonly IMapper _mapper;
  private readonly ILogger<ColumnService> _logger;

  public ColumnService(IColumnRepository columnRepository, IMapper mapper, ILogger<ColumnService> logger)
  {
    _columnRepository = columnRepository;
    _mapper = mapper;
    _logger = logger;
  }

  public async Task<IEnumerable<ColumnDto>> GetAllAsync(Guid workspaceId, string userId)
  {
    if (!await _columnRepository.UserHasAccessToWorkspaceAsync(workspaceId, userId))
    {
      throw new ForbiddenException($"User does not have access to workspace {workspaceId}");
    }

    var columns = await _columnRepository.GetAllByWorkspaceAsync(workspaceId);
    return _mapper.Map<IEnumerable<ColumnDto>>(columns);
  }

  public async Task<ColumnDto> GetByIdAsync(Guid id, string userId)
  {
    var column = await _columnRepository.GetByIdAsync(id);
    if (column == null)
    {
      throw new NotFoundException("Column", id);
    }

    if (!await _columnRepository.UserHasAccessToWorkspaceAsync(column.WorkspaceId, userId))
    {
      throw new ForbiddenException($"User does not have access to column {id}");
    }

    return _mapper.Map<ColumnDto>(column);
  }

  public async Task<ColumnDto> CreateAsync(Guid workspaceId, CreateColumnDto createColumnDto, string userId)
  {
    if (!await _columnRepository.UserHasAccessToWorkspaceAsync(workspaceId, userId))
    {
      throw new ForbiddenException($"User does not have access to workspace {workspaceId}");
    }


    if (!await _columnRepository.WorkspaceExistsAsync(workspaceId))
    {
      throw new NotFoundException("Workspace", workspaceId);
    }

    var maxPosition = await _columnRepository.GetMaxPositionAsync(workspaceId);

    var column = new Column(
      title: createColumnDto.Title,
      color: createColumnDto.Color,
      workspaceId: workspaceId
    );

    column.SetPosition(maxPosition + 1);

    var createdColumn = await _columnRepository.CreateAsync(column);
    return _mapper.Map<ColumnDto>(createdColumn);
  }

  public async Task<ColumnDto> UpdateAsync(Guid id, UpdateColumnDto updateColumnDto, string userId)
  {
    var column = await _columnRepository.GetByIdAsync(id);
    if (column == null)
    {
      throw new NotFoundException("Column", id);
    }

    if (!await _columnRepository.UserHasAccessToWorkspaceAsync(column.WorkspaceId, userId))
    {
      throw new ForbiddenException($"User does not have access to column {id}");
    }

    column.Update(
      title: updateColumnDto.Title,
      color: updateColumnDto.Color,
      position: updateColumnDto.Position
    );

    var updatedColumn = await _columnRepository.UpdateAsync(column);
    return _mapper.Map<ColumnDto>(updatedColumn);
  }

  public async Task DeleteAsync(Guid id, string userId)
  {
    var column = await _columnRepository.GetByIdAsync(id);
    if (column == null)
    {
      throw new NotFoundException("Column", id);
    }

    if (!await _columnRepository.UserHasAccessToWorkspaceAsync(column.WorkspaceId, userId))
    {
      throw new ForbiddenException($"User does not have access to column {id}");
    }

    await _columnRepository.DeleteAsync(column);
  }

  public async Task UpdateColumnPositionsAsync(Guid workspaceId, List<UpdateColumnPositionDto> updates, string userId)
  {
    _logger.LogInformation("Updating positions for {Count} columns in workspace {WorkspaceId}", updates.Count, workspaceId);

    if (!await _columnRepository.UserHasAccessToWorkspaceAsync(workspaceId, userId))
    {
      throw new ForbiddenException($"User does not have access to workspace: {workspaceId}");
    }

    var columnIds = updates.Select(u => u.Id).ToList();
    var columns = new List<Column>();

    foreach (var columnId in columnIds)
    {
      var column = await _columnRepository.GetByIdAsync(columnId);
      if (column == null)
      {
        throw new NotFoundException("Column", columnId);
      }

      if (column.WorkspaceId != workspaceId)
      {
        throw new BusinessValidationException($"Column {columnId} does not belong to workspace {workspaceId}");
      }

      columns.Add(column);
    }

    foreach (var update in updates)
    {
      var column = columns.First(c => c.Id == update.Id);
      column.SetPosition(update.Position);
      await _columnRepository.UpdateAsync(column);
    }

    _logger.LogInformation("Successfully updated positions for {Count} columns", updates.Count);
  }
}