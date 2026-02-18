import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import BottomBar from '@/components/BottomBar';

describe('BottomBar', () => {
  it('renders without crashing', () => {
    render(<BottomBar />);
  });

  it('renders a fixed bottom bar', () => {
    const { container } = render(<BottomBar />);
    const bar = container.querySelector('.fixed.bottom-0');
    expect(bar).toBeInTheDocument();
  });

  it('has black background', () => {
    const { container } = render(<BottomBar />);
    const bar = container.querySelector('.bg-black');
    expect(bar).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<BottomBar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
