import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

vi.mock('@/components/Pet', () => ({
  default: () => <div data-testid="pet-component">Pet</div>,
}));

describe('Home page', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });

  it('renders the Pet component', () => {
    render(<Home />);
    expect(screen.getByTestId('pet-component')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<Home />);
    expect(container).toMatchSnapshot();
  });
});
