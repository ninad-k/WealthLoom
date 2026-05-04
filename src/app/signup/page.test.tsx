import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreatorSignupPage from './page';

// Mock the SITE_CONFIG
jest.mock('@/lib/constants', () => ({
  SITE_CONFIG: {
    name: 'Core Stream Mock',
  },
}));

describe('Creator Signup Page', () => {
  it('renders the first step initially', () => {
    render(<CreatorSignupPage />);
    
    expect(screen.getByText('Create your video academy')).toBeInTheDocument();
    expect(screen.getByText('School Name')).toBeInTheDocument();
    
    // Step 2 elements should not be present
    expect(screen.queryByText('Choose Subdomain')).not.toBeInTheDocument();
  });

  it('navigates to step 2 when the form is submitted', () => {
    render(<CreatorSignupPage />);
    
    const input = screen.getByPlaceholderText('e.g. Design Masterclass');
    fireEvent.change(input, { target: { value: 'My Awesome School' } });
    
    const submitBtn = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(submitBtn);

    // Should now be on step 2
    expect(screen.getByText('Choose Subdomain')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your-school')).toBeInTheDocument();
  });

  it('navigates to step 3 and displays the school name', () => {
    render(<CreatorSignupPage />);
    
    // Step 1
    const schoolInput = screen.getByPlaceholderText('e.g. Design Masterclass');
    fireEvent.change(schoolInput, { target: { value: 'My Awesome School' } });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // Step 2
    const subdomainInput = screen.getByPlaceholderText('your-school');
    fireEvent.change(subdomainInput, { target: { value: 'awesome' } });
    fireEvent.click(screen.getByRole('button', { name: /Verify & Next/i }));

    // Step 3
    expect(screen.getByText('Great! My Awesome School is ready.')).toBeInTheDocument();
    expect(screen.getByText(/awesome.corestream.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go to my Admin Dashboard/i })).toBeInTheDocument();
  });
});
