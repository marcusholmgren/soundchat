import * as React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Google sign-in prompt', () => {
  const { getByText } = render(<App />);
  const prompt = getByText(/sign in with google to continue/i);
  expect(prompt).toBeInTheDocument();
});
