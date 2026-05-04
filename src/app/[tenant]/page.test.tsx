import React from 'react';
import { render, screen } from '@testing-library/react';
import TenantHomePage from './page';

// Mock getTenant
jest.mock('@/lib/tenants', () => ({
  getTenant: jest.fn(() => ({
    id: 'wealthloom',
    name: 'WealthLoom Mock Academy',
    company: 'WealthLoom Inc.',
    description: 'Master the markets with precision and vision.',
    brand: {
      first: 'Wealth',
      second: 'Loom',
      primaryColor: '#f59e0b',
      secondaryColor: '#020617',
    },
    pricing: [
      { name: 'Free', price: '$0', features: ['Basic Videos'] },
      { name: 'Pro', price: '$49', features: ['All Videos'] },
    ],
  })),
}));

describe('Tenant Landing Page', () => {
  it('renders the tenant branding correctly', () => {
    const { container } = render(<TenantHomePage />);
    
    // Check if the tenant name renders
    expect(screen.getByText('WealthLoom Mock Academy')).toBeInTheDocument();
    
    // Check if the description renders
    expect(screen.getByText('Master the markets with precision and vision.')).toBeInTheDocument();

    // Check if the brand first and second parts render
    const brandFirst = screen.getAllByText('Wealth')[0];
    const brandSecond = screen.getAllByText('Loom')[0];
    expect(brandFirst).toBeInTheDocument();
    expect(brandSecond).toBeInTheDocument();

    // Check if CSS variables are injected in the style attribute
    // React Testing Library allows checking styles, but since it's an inline style with custom vars, we can check the DOM string
    expect(container.innerHTML).toContain('--primary: #f59e0b');
    expect(container.innerHTML).toContain('--background: #020617');
  });

  it('renders the tenant pricing plans', () => {
    render(<TenantHomePage />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('Basic Videos')).toBeInTheDocument();

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('$49')).toBeInTheDocument();
    expect(screen.getByText('All Videos')).toBeInTheDocument();
  });
});
