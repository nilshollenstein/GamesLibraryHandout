import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the correct heading', () => {
  render(<App />);
  const heading = screen.getByText('Games Library');
  expect(heading).toBeInTheDocument();
});
