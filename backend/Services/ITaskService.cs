using TodoApi.DTOs;

namespace TodoApi.Services
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskDto>> GetAllAsync(int userId, TaskQueryDto query);
        Task<TaskDto?> GetByIdAsync(int userId, int id);
        Task<TaskDto> CreateAsync(int userId, TaskSaveDto dto);
        Task<TaskDto?> UpdateAsync(int userId, int id, TaskUpdateDto dto);
        Task<bool> ToggleCompletedAsync(int userId, int id);
        Task<bool> DeleteAsync(int userId, int id);
        Task<TaskStatsDto> GetStatsAsync(int userId);
        Task<IEnumerable<string>> GetCategoriesAsync(int userId);
    }
}
