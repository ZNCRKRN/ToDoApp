using System.ComponentModel.DataAnnotations;
using TodoApi.Models;

namespace TodoApi.DTOs
{
    public class TaskSaveDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [MaxLength(50)]
        public string? Category { get; set; }
    }
}
