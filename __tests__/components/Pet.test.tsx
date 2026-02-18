import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pet from '@/components/Pet';

vi.mock('@/hooks/useOrientation', () => ({
  useOrientation: () => true,
}));

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });

describe('Pet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorageMock.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  it('renders without crashing', () => {
    render(<Pet />);
  });

  it('displays pet info section', () => {
    render(<Pet />);
    expect(screen.getAllByText(/level/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/favorite food/i)).toBeInTheDocument();
    expect(screen.getByText(/customize/i)).toBeInTheDocument();
  });

  it('displays Tasks section', () => {
    render(<Pet />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('displays shop and feed buttons', () => {
    render(<Pet />);
    expect(screen.getByText('shop')).toBeInTheDocument();
    expect(screen.getByText('feed')).toBeInTheDocument();
  });

  it('displays Reset button', () => {
    render(<Pet />);
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('displays time left section', () => {
    render(<Pet />);
    expect(screen.getByText(/time left/i)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Pet />);
    expect(container).toMatchSnapshot();
  });
});
