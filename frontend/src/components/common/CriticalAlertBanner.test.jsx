import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CriticalAlertBanner from './CriticalAlertBanner';

describe('CriticalAlertBanner Component', () => {
  it('renders nothing when alert is null', () => {
    const { container } = render(<CriticalAlertBanner alert={null} onDismiss={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders alert message properly', () => {
    const mockAlert = { message: 'Crowd crushing detected', timestamp: new Date().toISOString() };
    render(<CriticalAlertBanner alert={mockAlert} onDismiss={() => {}} />);
    expect(screen.getByText('Crowd crushing detected')).toBeDefined();
  });

  it('calls onDismiss when close button is clicked', () => {
    const mockAlert = { message: 'Alert' };
    const mockOnDismiss = vi.fn();
    render(<CriticalAlertBanner alert={mockAlert} onDismiss={mockOnDismiss} />);
    
    const closeButton = screen.getByRole('button', { name: /dismiss alert/i });
    fireEvent.click(closeButton);
    expect(mockOnDismiss).toHaveBeenCalled();
  });
});
