import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Shop } from '@/components/Shop';
import { mockFoodItems, mockLocations, mockCosmetics } from '../fixtures';

const defaultProps = {
  onClose: vi.fn(),
  currCoins: 100,
  setCurrCoins: vi.fn(),
  setTargetCoins: vi.fn(),
  foodItems: mockFoodItems,
  setFoodItems: vi.fn(),
  favoriteFood: 'onigiri',
  locations: mockLocations,
  setLocations: vi.fn(),
  setCurrBg: vi.fn(),
  cosmetics: mockCosmetics,
  setCosmetics: vi.fn(),
  equipCosmetic: vi.fn(),
};

describe('Shop', () => {
  it('renders without crashing', () => {
    render(<Shop {...defaultProps} />);
  });

  it('displays main shop sections', () => {
    render(<Shop {...defaultProps} />);
    expect(screen.getByText(/food/i)).toBeInTheDocument();
    expect(screen.getByText(/locations/i)).toBeInTheDocument();
    expect(screen.getByText(/cosmetics/i)).toBeInTheDocument();
  });

  it('displays current coins', () => {
    render(<Shop {...defaultProps} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Shop {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
