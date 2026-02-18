import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Customize } from '@/components/Customize';
import { mockFoodItems, mockLocations, mockCosmetics } from '../fixtures';

const defaultProps = {
  onClose: vi.fn(),
  currFood: 'onigiri',
  setCurrFood: vi.fn(),
  foodItems: mockFoodItems,
  setFoodItems: vi.fn(),
  favoriteFood: 'onigiri',
  locations: mockLocations,
  currBg: 'livingroom/01/livingroom-01',
  setCurrBg: vi.fn(),
  cosmetics: mockCosmetics,
  equipCosmetic: vi.fn(),
};

describe('Customize', () => {
  it('renders without crashing', () => {
    render(<Customize {...defaultProps} />);
  });

  it('displays customize sections', () => {
    render(<Customize {...defaultProps} />);
    expect(screen.getByText(/food/i)).toBeInTheDocument();
    expect(screen.getByText(/locations/i)).toBeInTheDocument();
    expect(screen.getByText(/cosmetics/i)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Customize {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });
});
