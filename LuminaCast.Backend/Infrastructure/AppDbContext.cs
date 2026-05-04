using Microsoft.EntityFrameworkCore;
using LuminaCast.Backend.Domain.Entities;

namespace LuminaCast.Backend.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Tenant> Tenants { get; set; } = null!;
        public DbSet<Brand> Brands { get; set; } = null!;
        public DbSet<PricingTier> PricingTiers { get; set; } = null!;
        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<Subscription> Subscriptions { get; set; } = null!;
        public DbSet<Video> Videos { get; set; } = null!;
        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<CourseVideo> CourseVideos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tenant>().HasKey(t => t.Id);
            
            modelBuilder.Entity<Tenant>()
                .HasOne(t => t.Brand)
                .WithOne(b => b.Tenant)
                .HasForeignKey<Brand>(b => b.TenantId);

            modelBuilder.Entity<Tenant>()
                .HasMany(t => t.PricingTiers)
                .WithOne(p => p.Tenant)
                .HasForeignKey(p => p.TenantId);

            modelBuilder.Entity<Student>().HasKey(s => s.Id);

            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.Student)
                .WithMany(stu => stu.Subscriptions)
                .HasForeignKey(s => s.StudentId);

            modelBuilder.Entity<Subscription>()
                .HasOne(s => s.PricingTier)
                .WithMany()
                .HasForeignKey(s => s.PricingTierId);

            modelBuilder.Entity<PricingTier>()
                .HasOne(p => p.Course)
                .WithMany()
                .HasForeignKey(p => p.CourseId);

            // Many-to-Many configuration for Course and Video
            modelBuilder.Entity<CourseVideo>()
                .HasKey(cv => new { cv.CourseId, cv.VideoId });

            modelBuilder.Entity<CourseVideo>()
                .HasOne(cv => cv.Course)
                .WithMany(c => c.CourseVideos)
                .HasForeignKey(cv => cv.CourseId);

            modelBuilder.Entity<CourseVideo>()
                .HasOne(cv => cv.Video)
                .WithMany(v => v.CourseVideos)
                .HasForeignKey(cv => cv.VideoId);
        }
    }
}
