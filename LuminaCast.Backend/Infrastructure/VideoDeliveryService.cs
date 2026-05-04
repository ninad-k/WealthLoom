using System;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace LuminaCast.Backend.Infrastructure
{
    public interface IVideoDeliveryService
    {
        string GeneratePresignedUrl(string objectKey, int expirationMinutes = 60);
        string GeneratePresignedPutUrl(string objectKey, string contentType, int expirationMinutes = 60);
    }

    public class VideoDeliveryService : IVideoDeliveryService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly ILogger<VideoDeliveryService> _logger;

        public VideoDeliveryService(IConfiguration configuration, ILogger<VideoDeliveryService> logger)
        {
            _logger = logger;
            _bucketName = configuration["Storage:BucketName"] ?? "luminacast-videos";
            
            // Supports AWS S3 or S3-Compatible like Cloudflare R2
            var config = new AmazonS3Config
            {
                ServiceURL = configuration["Storage:ServiceUrl"], 
                AuthenticationRegion = configuration["Storage:Region"] ?? "auto"
            };

            _s3Client = new AmazonS3Client(
                configuration["Storage:AccessKey"],
                configuration["Storage:SecretKey"],
                config
            );
        }

        public string GeneratePresignedUrl(string objectKey, int expirationMinutes = 60)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = objectKey,
                    Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                    Protocol = Protocol.HTTPS
                };

                var url = _s3Client.GetPreSignedURL(request);
                
                _logger.LogInformation("Audit: Generated Presigned GET URL for {ObjectKey} expiring in {Minutes}m", objectKey, expirationMinutes);
                
                return url;
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "Error generating presigned GET URL for {ObjectKey}", objectKey);
                throw;
            }
        }

        public string GeneratePresignedPutUrl(string objectKey, string contentType, int expirationMinutes = 60)
        {
            try
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = objectKey,
                    Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                    Verb = HttpVerb.PUT,
                    ContentType = contentType,
                    Protocol = Protocol.HTTPS
                };

                var url = _s3Client.GetPreSignedURL(request);
                
                _logger.LogInformation("Audit: Generated Presigned PUT URL for {ObjectKey} expiring in {Minutes}m", objectKey, expirationMinutes);
                
                return url;
            }
            catch (AmazonS3Exception ex)
            {
                _logger.LogError(ex, "Error generating presigned PUT URL for {ObjectKey}", objectKey);
                throw;
            }
        }
    }
}
