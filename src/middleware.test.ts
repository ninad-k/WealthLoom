import { middleware } from './middleware';
import { NextRequest, NextResponse } from 'next/server';

// Mock NextRequest
function createMockRequest(url: string, hostHeader: string) {
  const req = new NextRequest(new URL(url));
  req.headers.set('host', hostHeader);
  return req;
}

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      next: jest.fn(() => ({ type: 'next' })),
      rewrite: jest.fn((url) => ({ type: 'rewrite', url: url.toString() })),
    },
  };
});

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'corestream.com';
  });

  it('should pass through root domain requests', () => {
    const req = createMockRequest('http://corestream.com/about', 'corestream.com');
    const response = middleware(req) as any;
    expect(response.type).toBe('next');
  });

  it('should pass through www root domain requests', () => {
    const req = createMockRequest('http://www.corestream.com/pricing', 'www.corestream.com');
    const response = middleware(req) as any;
    expect(response.type).toBe('next');
  });

  it('should rewrite subdomain requests to the dynamic tenant path', () => {
    const req = createMockRequest('http://wealthloom.corestream.com/dashboard', 'wealthloom.corestream.com');
    const response = middleware(req) as any;
    
    expect(response.type).toBe('rewrite');
    expect(NextResponse.rewrite).toHaveBeenCalled();
    // The rewrite URL should prepend the tenant ID to the path
    const rewriteUrl = (NextResponse.rewrite as jest.Mock).mock.calls[0][0].toString();
    expect(rewriteUrl).toContain('/wealthloom/dashboard');
  });

  it('should rewrite custom domain requests to the dynamic tenant path', () => {
    const req = createMockRequest('http://academy.investor.com/courses', 'academy.investor.com');
    const response = middleware(req) as any;
    
    expect(response.type).toBe('rewrite');
    expect(NextResponse.rewrite).toHaveBeenCalled();
    // For custom domains, it uses the full hostname
    const rewriteUrl = (NextResponse.rewrite as jest.Mock).mock.calls[0][0].toString();
    expect(rewriteUrl).toContain('/academy.investor.com/courses');
  });
});
