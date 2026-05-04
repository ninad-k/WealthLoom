import React from 'react';
import { render, screen } from '@testing-library/react';
import PlatformLandingPage from './page';

// Mock the SITE_CONFIG since it's imported in the component
jest.mock('@/lib/constants', () => ({
  SITE_CONFIG: {
    name: 'Core Stream',
    brand: {
      first: 'Core',
      second: 'Stream',
    },
  },
}));

describe('Platform Landing Page', () => {
  it('renders the main heading correctly', () => {
    render(<PlatformLandingPage />);
    const heading = screen.getByText(/Turn Your Knowledge into a/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the branding name correctly', () => {
    render(<PlatformLandingPage />);
    // Check if "Core" and "Stream" render from the mock
    const brandFirst = screen.getAllByText('Core')[0];
    const brandSecond = screen.getAllByText('Stream')[0];
    expect(brandFirst).toBeInTheDocument();
    expect(brandSecond).toBeInTheDocument();
  });

  it('renders the Call to Action links', () => {
    render(<PlatformLandingPage />);
    const launchLinks = screen.getAllByRole('link', { name: /Launch Your School/i });
    expect(launchLinks.length).toBeGreaterThan(0);
    
    // Check if the primary CTA href points to /signup
    expect(launchLinks[0]).toHaveAttribute('href', '/signup');

    const trialLinks = screen.getAllByRole('link', { name: /Start Your 14-Day Free Trial/i });
    expect(trialLinks.length).toBeGreaterThan(0);
    expect(trialLinks[0]).toHaveAttribute('href', '/signup');
  });

  it('renders the features section', () => {
    render(<PlatformLandingPage />);
    expect(screen.getByText('Custom Subdomains')).toBeInTheDocument();
    expect(screen.getByText('Anti-Piracy Vault')).toBeInTheDocument();
    expect(screen.getByText('Global Payments')).toBeInTheDocument();
  });
});
