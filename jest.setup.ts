import '@testing-library/jest-dom';

// Mock Next.js Navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useParams() {
    return {
      tenant: 'wealthloom',
    };
  },
}));

// Mock Clerk Authentication
jest.mock('@clerk/nextjs', () => {
  return {
    ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SignInButton: ({ children }: { children: React.ReactNode }) => <button data-testid="signin-btn">{children}</button>,
    SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
    SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
    UserButton: () => <button data-testid="user-btn">User</button>,
  };
});

// Mock Framer Motion to prevent animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: require('react').forwardRef(({ children, ...props }: any, ref: any) => {
      // Filter out framer-motion specific props to avoid warnings
      const { initial, animate, exit, transition, ...validProps } = props;
      return <div ref={ref} {...validProps}>{children}</div>;
    }),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
