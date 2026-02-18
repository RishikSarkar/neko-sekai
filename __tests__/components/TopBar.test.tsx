import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopBar from '@/components/TopBar';

describe('TopBar', () => {
  it('renders without crashing', () => {
    render(<TopBar />);
  });

  it('renders a fixed top bar', () => {
    const { container } = render(<TopBar />);
    const bar = container.querySelector('.fixed.top-0');
    expect(bar).toBeInTheDocument();
  });

  it('has black background', () => {
    const { container } = render(<TopBar />);
    const bar = container.querySelector('.bg-black');
    expect(bar).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<TopBar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
