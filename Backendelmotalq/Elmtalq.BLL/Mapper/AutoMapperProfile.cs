using AutoMapper;
using Elmtalq.DAL.Entities;
using Elmtalq.DAL.Enums;
using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.DTOS.Admin;

namespace Elmtalq.BLL.Mapper;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Candidate mappings for Public
        CreateMap<CandidateCreateDto, Candidate>()
            .ForMember(dest => dest.CVFilePath, opt => opt.Ignore())
            .ForMember(dest => dest.PersonalPhotoFilePath, opt => opt.Ignore())
            .ForMember(dest => dest.IntroductionVideoFilePath, opt => opt.Ignore())
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedEmployeeId, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedEmployee, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

        CreateMap<Candidate, CandidateResponseDto>();

        // Company mappings for Public
        CreateMap<CompanyCreateDto, Company>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedEmployeeId, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedEmployee, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());

        CreateMap<Company, CompanyResponseDto>();

        // CompanyInfo mappings for Public
        CreateMap<CompanyInfo, AboutResponseDto>()
            .ForMember(dest => dest.CompanyDescription, opt => opt.MapFrom(src => src.CompanyDescription))
            .ForMember(dest => dest.OfficeLocation, opt => opt.MapFrom(src => src.OfficeLocation));

        CreateMap<CompanyInfo, ContactResponseDto>()
            .ForMember(dest => dest.Facebook, opt => opt.MapFrom(src => src.Facebook))
            .ForMember(dest => dest.Instagram, opt => opt.MapFrom(src => src.Instagram))
            .ForMember(dest => dest.WhatsApp, opt => opt.MapFrom(src => src.WhatsApp))
            .ForMember(dest => dest.LinkedIn, opt => opt.MapFrom(src => src.LinkedIn))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ContactEmail))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.ContactPhone));

        // Employee mappings for Admin
        CreateMap<Employee, EmployeeResponseDto>();
        CreateMap<EmployeeCreateDto, Employee>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Will be handled in service
            .ForMember(dest => dest.Id, opt => opt.Ignore());
        CreateMap<EmployeeUpdateDto, Employee>()
            .ForMember(dest => dest.Id, opt => opt.Ignore());

        // Candidate mappings for Admin
        CreateMap<Candidate, CandidateAdminResponseDto>()
            .ForMember(dest => dest.AssignedEmployeeName, opt => opt.MapFrom(src => src.AssignedEmployee != null ? src.AssignedEmployee.Name : null));
        CreateMap<CandidateUpdateDto, Candidate>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedEmployeeId, opt => opt.Ignore());

        // Company mappings for Admin
        CreateMap<Company, CompanyAdminResponseDto>()
            .ForMember(dest => dest.AssignedEmployeeName, opt => opt.MapFrom(src => src.AssignedEmployee != null ? src.AssignedEmployee.Name : null));
        CreateMap<CompanyUpdateDto, Company>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.AssignedEmployeeId, opt => opt.Ignore());

        // Assignment mappings
        CreateMap<Employee, AssignmentDto>();
    }
}
