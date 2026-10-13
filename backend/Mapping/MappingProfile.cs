using AutoMapper;
using TodoApi.DTOs;
using TodoApi.Models;

namespace TodoApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<TodoTask, TaskDto>();
            CreateMap<TaskSaveDto, TodoTask>();
            CreateMap<TaskUpdateDto, TodoTask>();
        }
    }
}
