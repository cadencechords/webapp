import { fireEvent, render, screen } from '@testing-library/react';
import TokensPage from './TokensPage';

test('renders every token section and the dragged-state toggle', () => {
  render(<TokensPage />);
  for (const title of ['Color', 'Type scale', 'Shape', 'Elevation', 'State layers and focus', 'Motion']) {
    expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
  }
  // 49 roles in both the light and dark swatch sheets
  expect(screen.getAllByText('primary-container')).toHaveLength(2);
  expect(screen.getAllByText('emphasized')).toHaveLength(15);

  const drag = screen.getByRole('button', { name: 'Drag me' });
  fireEvent.click(drag);
  expect(drag).toHaveAttribute('data-dragging', 'true');
  expect(drag).toHaveTextContent('Dragging');

  const morph = screen.getByRole('button', { name: /Shape morph/ });
  fireEvent.click(morph);
  expect(morph).toHaveAttribute('aria-pressed', 'true');
});
