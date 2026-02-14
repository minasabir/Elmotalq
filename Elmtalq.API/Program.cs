using Microsoft.EntityFrameworkCore;
using Elmtalq.DAL.Database;
using Elmtalq.DAL.Repo.Abstraction;
using Elmtalq.DAL.Repo.Implementation;
using Elmtalq.BLL.Servicies.Abstraction;
using Elmtalq.BLL.Servicies.Implementation;
using Elmtalq.BLL.Helper;
using Elmtalq.BLL.Mapper;
using Elmtalq.API.Middleware;
using Elmtalq.API.Helper;
using Elmtalq.API.Services;
using Microsoft.OpenApi.Models;
using FluentValidation;
using Elmtalq.BLL.DTOS.Public;
using Elmtalq.BLL.DTOS.Admin;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository layer
builder.Services.AddScoped<IGenericRepository<Elmtalq.DAL.Entities.Employee>, GenericRepository<Elmtalq.DAL.Entities.Employee>>();
builder.Services.AddScoped<IGenericRepository<Elmtalq.DAL.Entities.Candidate>, GenericRepository<Elmtalq.DAL.Entities.Candidate>>();
builder.Services.AddScoped<IGenericRepository<Elmtalq.DAL.Entities.Company>, GenericRepository<Elmtalq.DAL.Entities.Company>>();
builder.Services.AddScoped<IGenericRepository<Elmtalq.DAL.Entities.CompanyInfo>, GenericRepository<Elmtalq.DAL.Entities.CompanyInfo>>();

builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ICompanyInfoRepository, CompanyInfoRepository>();

// AutoMapper
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapperProfile>());

// File Helper
builder.Services.AddSingleton<FileHelper>(provider => 
    new FileHelper(Path.Combine(Directory.GetCurrentDirectory(), "Uploads")));

// Service layer
builder.Services.AddScoped<ICandidateService, CandidateService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<ICompanyInfoService, CompanyInfoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<ICandidateAdminService, CandidateAdminService>();
builder.Services.AddScoped<ICompanyAdminService, CompanyAdminService>();

// Override Auth Service with API implementation
builder.Services.AddScoped<IAuthService>(provider => 
{
    var baseAuthService = new AuthService(
        provider.GetRequiredService<IEmployeeRepository>(),
        provider.GetRequiredService<IConfiguration>());
    return new ApiAuthService(baseAuthService, provider.GetRequiredService<IConfiguration>());
});

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CandidateCreateDtoValidator>();

// JWT Authentication
JwtAuthenticationHelper.AddJwtAuthentication(builder.Services, builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
             .AllowAnyMethod()
             .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
// builder.Services.AddOpenApi();

// Add Swagger - Basic configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Elmtalq Recruitment API", Version = "v1" });

    // JWT Authentication for Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsIn...\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    
    // Enable Swagger UI
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Elmtalq Recruitment API v1");
        c.RoutePrefix = "swagger";
    });

    // Auto-redirect root to Swagger Config
    app.MapGet("/", async context =>
    {
        context.Response.Redirect("/swagger");
        await Task.CompletedTask;
    });
}

// Global Exception Handling Middleware (must be first)
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

// Configure middleware in correct order
app.UseHttpsRedirection();

// CORS (must be before routing)
app.UseCors("AllowAll");

// Routing (must be before authentication/authorization)
app.UseRouting();

// Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Seed Data
using (var scope = app.Services.CreateScope())
{
    await DataSeeder.SeedData(app);
}

app.Run();
