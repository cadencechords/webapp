import { fireEvent, render, screen } from '@testing-library/react';
import ComponentsPage from './ComponentsPage';

test('renders the button fixtures and their groups work', () => {
  render(<ComponentsPage />);
  for (const title of ['Buttons', 'Connected button groups']) {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  }
  // One button per color in each of the four labelled variants
  expect(screen.getAllByRole('button', { name: 'pink' })).toHaveLength(4);

  fireEvent.click(screen.getByRole('button', { name: 'Minor' }));
  expect(screen.getByRole('button', { name: 'Minor' })).toHaveClass(
    'bg-primary'
  );
});
