using TodoApi.Models;

namespace TodoApi.DTOs
{
    public class TaskQueryDto
    {
        public string? Search { get; set; }
        public TaskPriority? Priority { get; set; }
        public string? Category { get; set; }
        public bool? IsCompleted { get; set; }
        public string? SortBy { get; set; } = "dueDate"; // dueDate | priority | title | createdDate
        public bool Descending { get; set; } = false;
    }
}
