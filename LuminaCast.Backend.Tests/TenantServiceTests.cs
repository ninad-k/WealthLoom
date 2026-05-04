using System.Security.Claims;
using System.Threading.Tasks;
using Grpc.Core;
using LuminaCast.Backend.Domain.Entities;
using LuminaCast.Backend.Infrastructure;
using LuminaCast.Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Corestream.Tenant;
using System.Collections.Generic;

namespace LuminaCast.Backend.Tests
{
    public class TenantServiceTests
    {
        private readonly Mock<ITenantRepository> _mockRepo;
        private readonly Mock<ILogger<TenantService>> _mockLogger;
        private readonly Mock<IVideoDeliveryService> _mockVideoService;

        public TenantServiceTests()
        {
            _mockRepo = new Mock<ITenantRepository>();
            _mockLogger = new Mock<ILogger<TenantService>>();
            _mockVideoService = new Mock<IVideoDeliveryService>();
        }

        private AppDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        private ServerCallContext CreateMockServerCallContext(string userId)
        {
            var mockContext = new Mock<ServerCallContext>();
            var httpContext = new DefaultHttpContext();
            
            // Mock the JWT Bearer Claims
            var claims = new List<Claim> { new Claim(ClaimTypes.NameIdentifier, userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            var claimsPrincipal = new ClaimsPrincipal(identity);
            httpContext.User = claimsPrincipal;

            // Mock the Service Provider to return the VideoDeliveryService
            var serviceProvider = new Mock<System.IServiceProvider>();
            serviceProvider.Setup(x => x.GetService(typeof(IVideoDeliveryService))).Returns(_mockVideoService.Object);
            httpContext.RequestServices = serviceProvider.Object;

            mockContext.Setup(c => c.GetHttpContext()).Returns(httpContext);
            return mockContext.Object;
        }

        [Fact]
        public async Task GetSecureVideoUrl_WithoutActiveSubscription_ThrowsPermissionDenied()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            
            // Add a student with NO active subscriptions
            dbContext.Students.Add(new Student { Id = "user_123", Email = "test@test.com" });
            dbContext.Videos.Add(new Video { Id = 1, Title = "Secret Video" });
            await dbContext.SaveChangesAsync();

            var service = new TenantService(_mockRepo.Object, _mockLogger.Object, dbContext);
            var request = new VideoRequest { VideoId = 1 };
            var context = CreateMockServerCallContext("user_123");

            // Act & Assert
            var exception = await Assert.ThrowsAsync<RpcException>(() => service.GetSecureVideoUrl(request, context));
            Assert.Equal(StatusCode.PermissionDenied, exception.StatusCode);
            Assert.Contains("Active subscription required", exception.Status.Detail);
        }

        [Fact]
        public async Task GetSecureVideoUrl_WithValidSubscription_ReturnsPresignedUrl()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            
            // Create the full pricing/course graph
            var course = new Course { Id = 1, Title = "Masterclass" };
            var video = new Video { Id = 1, Title = "Secret Video", S3ObjectKey = "test.mp4" };
            var courseVideo = new CourseVideo { CourseId = 1, VideoId = 1 };
            var pricingTier = new PricingTier { Id = 1, CourseId = 1 };
            var student = new Student { Id = "user_123", Email = "test@test.com" };
            var subscription = new Subscription { Id = 1, StudentId = "user_123", PricingTierId = 1, Status = "active" };

            dbContext.Courses.Add(course);
            dbContext.Videos.Add(video);
            dbContext.CourseVideos.Add(courseVideo);
            dbContext.PricingTiers.Add(pricingTier);
            dbContext.Students.Add(student);
            dbContext.Subscriptions.Add(subscription);
            await dbContext.SaveChangesAsync();

            // Mock S3 generation
            _mockVideoService.Setup(x => x.GeneratePresignedUrl("test.mp4", 60)).Returns("https://s3.mock/url");

            var service = new TenantService(_mockRepo.Object, _mockLogger.Object, dbContext);
            var request = new VideoRequest { VideoId = 1 };
            var context = CreateMockServerCallContext("user_123");

            // Act
            var response = await service.GetSecureVideoUrl(request, context);

            // Assert
            Assert.NotNull(response);
            Assert.Equal("https://s3.mock/url", response.PresignedUrl);
            Assert.Equal("Secret Video", response.Title);
        }
    }
}
