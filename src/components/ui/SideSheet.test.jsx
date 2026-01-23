import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SideSheet from './SideSheet';
import { FriendProvider } from '../../context/FriendContext';

// Mock friend object for testing
const mockFriend = {
    id: '1',
    name: 'Test Friend',
    passphrase: 'sun1moon2star',
    modules: [],
};

// Wrapper component providing required context
const TestWrapper = ({ children }) => (
    <MemoryRouter>
        <FriendProvider>
            {children}
        </FriendProvider>
    </MemoryRouter>
);

describe('SideSheet', () => {
    it('renders without crashing when closed', () => {
        // Should return null when not open
        const { container } = render(
            <TestWrapper>
                <SideSheet isOpen={false} onClose={() => { }} friend={null} />
            </TestWrapper>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders without crashing when open with friend', () => {
        // This is the critical test - the React.useState bug would cause this to crash
        render(
            <TestWrapper>
                <SideSheet isOpen={true} onClose={() => { }} friend={mockFriend} />
            </TestWrapper>
        );
        // If we get here without crashing, the useState bug is fixed
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders friend name in CoreIdentityCard', () => {
        render(
            <TestWrapper>
                <SideSheet isOpen={true} onClose={() => { }} friend={mockFriend} />
            </TestWrapper>
        );
        expect(screen.getByText('Test Friend')).toBeInTheDocument();
    });
});
