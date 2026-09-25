import { render, screen } from '@testing-library/react';
import StyledDialog from './StyledDialog';

// Tailwind v4's `transform` class no longer creates a containing block on its
// own, so the panel must be `relative`: otherwise the fixed overlay paints over
// it (taps dismiss the dialog) and the close button pins to the viewport.
test('the panel is positioned and contains the close button', () => {
  render(
    <StyledDialog open onCloseDialog={() => {}} title="Title" className="">
      <p>Body</p>
    </StyledDialog>
  );
  const panel = screen.getByText('Body').closest('.inline-block');
  expect(panel).toHaveClass('relative');
  expect(panel).toContainElement(screen.getByRole('button'));
});
