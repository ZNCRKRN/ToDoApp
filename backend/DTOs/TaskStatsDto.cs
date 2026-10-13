namespace TodoApi.DTOs
{
    public class TaskStatsDto
    {
        public int Total { get; set; }
        public int Completed { get; set; }
        public int Pending { get; set; }
        public double PercentageCompleted { get; set; }
    }
}
