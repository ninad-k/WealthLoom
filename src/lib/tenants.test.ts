import { getTenant, MOCK_TENANTS } from './tenants';

describe('Tenant Configuration Library', () => {
  it('should return the correct tenant when a valid subdomain is provided', () => {
    const tenant = getTenant('tradezenith');
    expect(tenant).toBeDefined();
    expect(tenant.id).toBe('tradezenith');
    expect(tenant.name).toBe('TradeZenith');
  });

  it('should return the correct tenant when a valid custom domain is provided', () => {
    // Assuming wealthloom has the custom domain 'academy.wealthloom.com'
    const tenant = getTenant('academy.wealthloom.com');
    expect(tenant).toBeDefined();
    expect(tenant.id).toBe('wealthloom');
  });

  it('should fallback to the default tenant (wealthloom) when an unknown domain is provided', () => {
    const tenant = getTenant('unknown-domain.com');
    expect(tenant).toBeDefined();
    expect(tenant.id).toBe('wealthloom');
  });

  it('should contain required pricing structures for mock tenants', () => {
    const tenant = getTenant('wealthloom');
    expect(tenant.pricing).toBeDefined();
    expect(tenant.pricing.length).toBeGreaterThan(0);
    expect(tenant.pricing[0].name).toBeDefined();
    expect(tenant.pricing[0].price).toBeDefined();
  });
});
