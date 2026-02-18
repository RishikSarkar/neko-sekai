import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Error from '@/app/error';

describe('Error', () => {
  it('renders without crashing', () => {
    render(<Error error={new Error('test')} reset={vi.fn()} />);
  });

  it('displays error message', () => {
    render(<Error error={new Error('test')} reset={vi.fn()} />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('calls reset when Try again is clicked', async () => {
    const reset = vi.fn();
    render(<Error error={new Error('test')} reset={reset} />);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reset).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { container } = render(<Error error={new Error('test')} reset={vi.fn()} />);
    expect(container).toMatchSnapshot();
  });
});
