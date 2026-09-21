import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders incorrect heading', () => {
  render(<App />);
  const heading = screen.getByText('Wrong Heading');
  expect(heading).toBeInTheDocument();
});
