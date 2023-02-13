import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Tests assert based on mock data here
jest.mock('./api');

test('renders the page properly', () => {
  render(<App />);

  const titleElement = screen.getByText(/coffee snob/i);

  expect(titleElement).toBeInTheDocument();
});

test('allows user to search for a zip code and displays the average rating', async () => {
  render(<App />);
  const inputElement = screen.getByLabelText(/zip code/i);
  const searchButton = screen.getByRole('button');

  fireEvent.change(inputElement, { target: { value: '11111' } });
  fireEvent.click(searchButton);

  expect(await screen.findByText('You searched: 11111')).toBeInTheDocument();
  expect(await screen.findByText(/test city/i)).toBeInTheDocument();
  expect(await screen.findByText(/average rating: 3\.6/i)).toBeInTheDocument();
});
