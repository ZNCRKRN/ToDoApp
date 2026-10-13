using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService taskService, ILogger<TasksController> logger)
        {
            _taskService = taskService;
            _logger = logger;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // GET api/tasks?search=&priority=&category=&isCompleted=&sortBy=&descending=
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAll([FromQuery] TaskQueryDto query)
        {
            var tasks = await _taskService.GetAllAsync(CurrentUserId, query);
            return Ok(tasks);
        }

        // GET api/tasks/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TaskDto>> GetById(int id)
        {
            var task = await _taskService.GetByIdAsync(CurrentUserId, id);
            if (task == null)
            {
                return NotFound(new { message = $"Id {id} ile görev bulunamadı." });
            }
            return Ok(task);
        }

        // GET api/tasks/stats
        [HttpGet("stats")]
        public async Task<ActionResult<TaskStatsDto>> GetStats()
        {
            var stats = await _taskService.GetStatsAsync(CurrentUserId);
            return Ok(stats);
        }

        // GET api/tasks/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _taskService.GetCategoriesAsync(CurrentUserId);
            return Ok(categories);
        }

        // POST api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskDto>> Create([FromBody] TaskSaveDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.DueDate.Date < DateTime.Now.Date)
            {
                return BadRequest(new { message = "Geçmiş bir tarihe görev oluşturulamaz." });
            }

            try
            {
                var created = await _taskService.CreateAsync(CurrentUserId, dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Görev oluşturulurken hata oluştu.");
                return StatusCode(500, new { message = "Görev oluşturulurken bir hata oluştu." });
            }
        }

        // PUT api/tasks/5
        [HttpPut("{id:int}")]
        public async Task<ActionResult<TaskDto>> Update(int id, [FromBody] TaskUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updated = await _taskService.UpdateAsync(CurrentUserId, id, dto);
            if (updated == null)
            {
                return NotFound(new { message = $"Id {id} ile görev bulunamadı." });
            }

            return Ok(updated);
        }

        // PATCH api/tasks/5/toggle
        [HttpPatch("{id:int}/toggle")]
        public async Task<IActionResult> ToggleCompleted(int id)
        {
            var success = await _taskService.ToggleCompletedAsync(CurrentUserId, id);
            if (!success)
            {
                return NotFound(new { message = $"Id {id} ile görev bulunamadı." });
            }
            return NoContent();
        }

        // DELETE api/tasks/5 (soft delete)
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _taskService.DeleteAsync(CurrentUserId, id);
            if (!success)
            {
                return NotFound(new { message = $"Id {id} ile görev bulunamadı." });
            }
            return NoContent();
        }
    }
}
