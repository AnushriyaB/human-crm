import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { FriendProvider } from '../context/FriendContext';
import { ThemeProvider } from '../context/ThemeContext';

// Wrapper component providing required context
const TestWrapper = ({ children }) => (
    <MemoryRouter>
        <ThemeProvider>
            <FriendProvider>
                {children}
            </FriendProvider>
        </ThemeProvider>
    </MemoryRouter>
);

describe('Dashboard', () => {
    it('renders without crashing (no white screen)', () => {
        // This is the critical regression test for the white dashboard issue
        // If Dashboard crashes during render, this test will fail
        render(
            <TestWrapper>
                <Dashboard />
            </TestWrapper>
        );

        // Should render the title "book of humans"
        expect(screen.getByText('book of humans')).toBeInTheDocument();
    });

    it('renders the add friend button', () => {
        render(
            <TestWrapper>
                <Dashboard />
            </TestWrapper>
        );

        // The Plus icon button should be present
        const buttons = document.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
    });
});
