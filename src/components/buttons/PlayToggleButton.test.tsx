import { fireEvent, render, screen } from '@testing-library/react';
import PlayToggleButton from './PlayToggleButton';

test('PlayToggleButton is pressed while playing and squares off', () => {
  const onClick = vi.fn<() => void>();
  const { rerender } = render(
    <PlayToggleButton playing={false} label="Play" onClick={onClick} />
  );
  const button = screen.getByRole('button', { name: 'Play' });
  expect(button).toHaveAttribute('aria-pressed', 'false');
  // Large by default: 96px, round, morphing to 28px corners.
  expect(button).toHaveClass(
    'w-24',
    'h-24',
    'rounded-[48px]',
    '[--shape-morph-to:28px]',
    'shape-morph',
    'bg-primary',
    'text-on-primary'
  );
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);

  rerender(
    <PlayToggleButton playing label="Pause" size="medium" onClick={onClick} />
  );
  const pressed = screen.getByRole('button', { name: 'Pause' });
  expect(pressed).toHaveAttribute('aria-pressed', 'true');
  expect(pressed).toHaveClass('w-14', 'h-14', 'rounded-[28px]');
});

test('PlayToggleButton shows play, then the playing icon', () => {
  const { container, rerender } = render(
    <PlayToggleButton playing={false} label="Play" onClick={() => {}} />
  );
  const icon = () => container.querySelector('svg');
  expect(icon()).toBeInTheDocument();
  const play = icon()!.innerHTML;

  rerender(<PlayToggleButton playing label="Pause" onClick={() => {}} />);
  const pause = icon()!.innerHTML;
  expect(pause).not.toBe(play);

  rerender(
    <PlayToggleButton
      playing
      playingIcon="stop"
      label="Stop"
      onClick={() => {}}
    />
  );
  expect(icon()!.innerHTML).not.toBe(pause);
  expect(icon()!.innerHTML).not.toBe(play);
});
