using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LuminaCast.Backend.Domain.Entities;
using System.Text.Json;
using System.Collections.Generic;

namespace LuminaCast.Backend.Infrastructure
{
    public interface ITenantRepository
    {
        Task<Tenant?> GetTenantByIdOrDomainAsync(string domainOrId);
        Task SeedMockDataAsync();
    }

    public class TenantRepository : ITenantRepository
    {
        private readonly AppDbContext _context;

        public TenantRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Tenant?> GetTenantByIdOrDomainAsync(string domainOrId)
        {
            return await _context.Tenants
                .Include(t => t.Brand)
                .Include(t => t.PricingTiers)
                .FirstOrDefaultAsync(t => t.Id == domainOrId || t.CustomDomain == domainOrId);
        }

        public async Task SeedMockDataAsync()
        {
            if (await _context.Tenants.AnyAsync())
            {
                return; // Already seeded
            }

            var wealthloom = new Tenant
            {
                Id = "wealthloom",
                Name = "WealthLoom Academy",
                Company = "WealthLoom Inc.",
                Description = "Master the markets with precision and vision.",
                CustomDomain = "academy.wealthloom.com",
                Brand = new Brand
                {
                    First = "Wealth",
                    Second = "Loom",
                    PrimaryColor = "#f59e0b",
                    SecondaryColor = "#020617"
                },
                PricingTiers = new List<PricingTier>
                {
                    new PricingTier { Name = "Free", Price = "$0", FeaturesJson = JsonSerializer.Serialize(new[] { "Basic Videos" }) },
                    new PricingTier { Name = "Pro", Price = "$49", FeaturesJson = JsonSerializer.Serialize(new[] { "All Videos", "Flow Analysis" }) }
                }
            };

            var tradeZenith = new Tenant
            {
                Id = "tradezenith",
                Name = "TradeZenith",
                Company = "Zenith Trading Group",
                Description = "The peak of trading education.",
                Brand = new Brand
                {
                    First = "Trade",
                    Second = "Zenith",
                    PrimaryColor = "#10b981",
                    SecondaryColor = "#064e3b"
                },
                PricingTiers = new List<PricingTier>
                {
                    new PricingTier { Name = "Starter", Price = "$29", FeaturesJson = JsonSerializer.Serialize(new[] { "Intro Course" }) },
                    new PricingTier { Name = "Elite", Price = "$99", FeaturesJson = JsonSerializer.Serialize(new[] { "Masterclass" }) }
                }
            };

            await _context.Tenants.AddRangeAsync(wealthloom, tradeZenith);
            await _context.SaveChangesAsync();
        }
    }
}
