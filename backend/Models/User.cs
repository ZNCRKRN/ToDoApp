using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
    }
}
