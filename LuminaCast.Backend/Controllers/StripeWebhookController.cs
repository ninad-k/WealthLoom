using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using LuminaCast.Backend.Infrastructure;
using LuminaCast.Backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LuminaCast.Backend.Controllers
{
    [Route("api/webhooks/stripe")]
    [ApiController]
    public class StripeWebhookController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<StripeWebhookController> _logger;
        private readonly AppDbContext _dbContext;

        public StripeWebhookController(IConfiguration configuration, ILogger<StripeWebhookController> logger, AppDbContext dbContext)
        {
            _configuration = configuration;
            _logger = logger;
            _dbContext = dbContext;
        }

        [HttpPost]
        public async Task<IActionResult> Handle()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var endpointSecret = _configuration["Stripe:WebhookSecret"];

            try
            {
                // Verify the Stripe signature (ISO 27001 Annex A.10 Cryptography)
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    endpointSecret
                );

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;
                    await HandleCheckoutSessionCompleted(session);
                }

                return Ok();
            }
            catch (StripeException e)
            {
                _logger.LogError(e, "Stripe webhook signature validation failed.");
                return BadRequest();
            }
        }

        private async Task HandleCheckoutSessionCompleted(Session session)
        {
            if (session == null) return;

            // In a real app, you would pass the StudentId (Clerk ID) and PricingTierId
            // via the `client_reference_id` or `metadata` when creating the checkout session.
            var clerkUserId = session.ClientReferenceId;
            var stripeCustomerId = session.CustomerId;
            var stripeSubscriptionId = session.SubscriptionId;

            _logger.LogInformation("Audit: Stripe payment succeeded for Student {StudentId}", clerkUserId);

            // Mock Implementation: Upsert the student and unlock the subscription
            var student = await _dbContext.Students.FirstOrDefaultAsync(s => s.Id == clerkUserId);
            if (student == null && !string.IsNullOrEmpty(clerkUserId))
            {
                student = new Student
                {
                    Id = clerkUserId,
                    Email = session.CustomerDetails?.Email ?? "",
                    StripeCustomerId = stripeCustomerId
                };
                _dbContext.Students.Add(student);
            }

            if (student != null && !string.IsNullOrEmpty(stripeSubscriptionId))
            {
                var subscription = new Subscription
                {
                    StripeSubscriptionId = stripeSubscriptionId,
                    Status = "active",
                    Student = student,
                    PricingTierId = 2 // Hardcoded to 'Pro'/'Elite' for demonstration
                };
                _dbContext.Subscriptions.Add(subscription);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation("Audit: Access granted for Student {StudentId} to Subscription {SubId}", clerkUserId, stripeSubscriptionId);
            }
        }
    }
}
