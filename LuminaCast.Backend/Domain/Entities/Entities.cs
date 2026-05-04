using System.Collections.Generic;

namespace LuminaCast.Backend.Domain.Entities
{
    public class Tenant
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? CustomDomain { get; set; }
        public string? LogoUrl { get; set; }
        
        public Brand Brand { get; set; } = new Brand();
        public List<PricingTier> PricingTiers { get; set; } = new List<PricingTier>();
    }

    public class Brand
    {
        public int Id { get; set; }
        public string First { get; set; } = string.Empty;
        public string Second { get; set; } = string.Empty;
        public string PrimaryColor { get; set; } = string.Empty;
        public string SecondaryColor { get; set; } = string.Empty;
        
        public string TenantId { get; set; } = string.Empty;
        public Tenant Tenant { get; set; } = null!;
    }

    public class PricingTier
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Price { get; set; } = string.Empty;
        public string FeaturesJson { get; set; } = "[]"; 
        
        public string TenantId { get; set; } = string.Empty;
        public Tenant Tenant { get; set; } = null!;

        public int? CourseId { get; set; }
        public Course? Course { get; set; }
    }

    public class Student
    {
        public string Id { get; set; } = string.Empty; // Clerk User ID
        public string Email { get; set; } = string.Empty;
        public string StripeCustomerId { get; set; } = string.Empty;
        
        public List<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    }

    public class Subscription
    {
        public int Id { get; set; }
        public string StripeSubscriptionId { get; set; } = string.Empty;
        public string Status { get; set; } = "active";
        
        public string StudentId { get; set; } = string.Empty;
        public Student Student { get; set; } = null!;

        public int PricingTierId { get; set; }
        public PricingTier PricingTier { get; set; } = null!;
    }

    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
        public Tenant Tenant { get; set; } = null!;

        public List<CourseVideo> CourseVideos { get; set; } = new List<CourseVideo>();
    }

    public class Video
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string S3ObjectKey { get; set; } = string.Empty;
        public int DurationSeconds { get; set; }
        public string TenantId { get; set; } = string.Empty;

        public List<CourseVideo> CourseVideos { get; set; } = new List<CourseVideo>();
    }

    public class CourseVideo
    {
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public int VideoId { get; set; }
        public Video Video { get; set; } = null!;

        public int OrderIndex { get; set; } // The order of the video in the course
    }
}
