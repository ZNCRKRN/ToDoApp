using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class TodoTask
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public bool IsCompleted { get; set; } = false;

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [MaxLength(50)]
        public string? Category { get; set; }

        // Soft delete: a task is never physically removed, only deactivated.
        public bool IsActive { get; set; } = true;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}
