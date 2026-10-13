using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Services
{
    public class TaskService : ITaskService
    {
        private readonly TodoContext _context;
        private readonly IMapper _mapper;

        public TaskService(TodoContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TaskDto>> GetAllAsync(int userId, TaskQueryDto query)
        {
            var tasksQuery = _context.Tasks.Where(t => t.UserId == userId);

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                var term = query.Search.Trim().ToLower();
                tasksQuery = tasksQuery.Where(t =>
                    t.Title.ToLower().Contains(term) ||
                    (t.Description != null && t.Description.ToLower().Contains(term)));
            }

            if (query.Priority.HasValue)
            {
                tasksQuery = tasksQuery.Where(t => t.Priority == query.Priority.Value);
            }

            if (!string.IsNullOrWhiteSpace(query.Category))
            {
                tasksQuery = tasksQuery.Where(t => t.Category == query.Category);
            }

            if (query.IsCompleted.HasValue)
            {
                tasksQuery = tasksQuery.Where(t => t.IsCompleted == query.IsCompleted.Value);
            }

            tasksQuery = (query.SortBy?.ToLower(), query.Descending) switch
            {
                ("priority", false) => tasksQuery.OrderBy(t => t.Priority),
                ("priority", true) => tasksQuery.OrderByDescending(t => t.Priority),
                ("title", false) => tasksQuery.OrderBy(t => t.Title),
                ("title", true) => tasksQuery.OrderByDescending(t => t.Title),
                ("createddate", false) => tasksQuery.OrderBy(t => t.CreatedDate),
                ("createddate", true) => tasksQuery.OrderByDescending(t => t.CreatedDate),
                (_, true) => tasksQuery.OrderByDescending(t => t.DueDate),
                _ => tasksQuery.OrderBy(t => t.IsCompleted).ThenBy(t => t.DueDate)
            };

            var tasks = await tasksQuery.ToListAsync();
            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }

        public async Task<TaskDto?> GetByIdAsync(int userId, int id)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            return task == null ? null : _mapper.Map<TaskDto>(task);
        }

        public async Task<TaskDto> CreateAsync(int userId, TaskSaveDto dto)
        {
            var task = _mapper.Map<TodoTask>(dto);
            task.UserId = userId;
            task.CreatedDate = DateTime.Now;
            task.IsActive = true;
            task.IsCompleted = false;

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return _mapper.Map<TaskDto>(task);
        }

        public async Task<TaskDto?> UpdateAsync(int userId, int id, TaskUpdateDto dto)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return null;

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.DueDate = dto.DueDate;
            task.IsCompleted = dto.IsCompleted;
            task.Priority = dto.Priority;
            task.Category = dto.Category;

            await _context.SaveChangesAsync();
            return _mapper.Map<TaskDto>(task);
        }

        public async Task<bool> ToggleCompletedAsync(int userId, int id)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return false;

            task.IsCompleted = !task.IsCompleted;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int userId, int id)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (task == null) return false;

            // Soft delete: keep the row, just mark it inactive.
            task.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TaskStatsDto> GetStatsAsync(int userId)
        {
            var userTasks = _context.Tasks.Where(t => t.UserId == userId);

            var total = await userTasks.CountAsync();
            var completed = await userTasks.CountAsync(t => t.IsCompleted);

            return new TaskStatsDto
            {
                Total = total,
                Completed = completed,
                Pending = total - completed,
                PercentageCompleted = total == 0 ? 0 : Math.Round((double)completed / total * 100, 1)
            };
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync(int userId)
        {
            return await _context.Tasks
                .Where(t => t.UserId == userId && t.Category != null && t.Category != "")
                .Select(t => t.Category!)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }
    }
}
