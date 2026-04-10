using Microsoft.EntityFrameworkCore;
using Elmtalq.DAL.Entities;

namespace Elmtalq.DAL.Database;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<Candidate> Candidates { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<CompanyInfo> CompanyInfos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Employee entity
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Salary).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // Configure Candidate entity
        modelBuilder.Entity<Candidate>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.FullName).IsRequired().HasMaxLength(200);
            entity.Property(c => c.PhoneNumber).IsRequired().HasMaxLength(20);
            entity.Property(c => c.JobTitle).IsRequired().HasMaxLength(200);
            entity.Property(c => c.Country).HasMaxLength(100);
            entity.Property(c => c.Governorate).HasMaxLength(100);
            entity.Property(c => c.CVFilePath).HasMaxLength(500);
            entity.Property(c => c.PersonalPhotoFilePath).HasMaxLength(500);
            entity.Property(c => c.IntroductionVideoFilePath).HasMaxLength(500);

            // Configure foreign key
            entity.HasOne(c => c.AssignedEmployee)
                  .WithMany(e => e.AssignedCandidates)
                  .HasForeignKey(c => c.AssignedEmployeeId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Company entity
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.CompanyName).IsRequired().HasMaxLength(200);
            entity.Property(c => c.ContactPhone).IsRequired().HasMaxLength(20);
            entity.Property(c => c.Email).IsRequired().HasMaxLength(255);
            entity.Property(c => c.Country).IsRequired().HasMaxLength(100);
            entity.Property(c => c.City).IsRequired().HasMaxLength(100);
            entity.Property(c => c.RequiredJobTitle).IsRequired().HasMaxLength(200);
            entity.Property(c => c.CompanyIndustry).IsRequired().HasMaxLength(200);

            // Configure foreign key
            entity.HasOne(c => c.AssignedEmployee)
                  .WithMany(e => e.AssignedCompanies)
                  .HasForeignKey(c => c.AssignedEmployeeId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure CompanyInfo entity
        modelBuilder.Entity<CompanyInfo>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.CompanyDescription).IsRequired().HasMaxLength(1000);
            entity.Property(c => c.OfficeLocation).IsRequired().HasMaxLength(500);
            entity.Property(c => c.Facebook).HasMaxLength(500);
            entity.Property(c => c.Instagram).HasMaxLength(500);
            entity.Property(c => c.WhatsApp).HasMaxLength(50);
            entity.Property(c => c.LinkedIn).HasMaxLength(500);
            entity.Property(c => c.ContactEmail).HasMaxLength(255);
            entity.Property(c => c.ContactPhone).HasMaxLength(20);
        });

        // Apply soft delete filter globally
        ApplySoftDeleteFilter(modelBuilder);
    }

    private void ApplySoftDeleteFilter(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>().HasQueryFilter(e => !e.IsDeleted);
        modelBuilder.Entity<Candidate>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<Company>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<CompanyInfo>().HasQueryFilter(c => !c.IsDeleted);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entry in entries)
        {
            var entity = (BaseEntity)entry.Entity;
            
            if (entry.State == EntityState.Added)
            {
                entity.CreatedAt = DateTime.UtcNow;
            }
            
            entity.UpdatedAt = DateTime.UtcNow;

            if (entity.IsDeleted && entry.State == EntityState.Modified)
            {
                entity.DeletedAt = DateTime.UtcNow;
            }
        }
    }
}
