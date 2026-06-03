import React from 'react';
import { render } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from './App';

test('renders Google sign-in prompt', () => {
  const { getByText } = render(<App />);
  const prompt = getByText(/Sign in with Google/i);
  expect(prompt).toBeInTheDocument();
});
