import { createRef, type MouseEventHandler } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button, { buttonClasses } from './Button';
import AddCancelActions from './buttons/AddCancelActions';
import MobileMenuButton from './buttons/MobileMenuButton';
import TransposeOption from './TransposeOption';
import useDialog from '../hooks/useDialog';

// These pin the defaults that used to live in defaultProps (CAD-118).

describe('Button', () => {
  test('defaults to a small blue filled button', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('px-4', 'h-10', 'bg-primary', 'text-on-primary');
    expect(button).not.toHaveClass('w-full');
    expect(button).toBeEnabled();
  });

  test('a loading filled button is disabled and hides its label', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  test('open variant: bold, labelled by name, no clicks while loading', () => {
    const onClick = vi.fn<MouseEventHandler<HTMLButtonElement>>();
    const { rerender } = render(
      <Button variant="open" name="Close" onClick={onClick}>
        x
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveClass('text-primary', 'px-4');
    expect(button).not.toHaveClass('font-normal');
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button variant="open" name="Close" onClick={onClick} loading>
        x
      </Button>
    );
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('icon variant gets the small size and blue color by default', () => {
    render(<Button variant="icon">i</Button>);
    expect(screen.getByRole('button')).toHaveClass(
      'p-1',
      'min-h-8',
      'text-primary'
    );
  });

  test('accent and open variants forward their ref', () => {
    const accent = createRef<HTMLButtonElement>();
    const open = createRef<HTMLButtonElement>();
    render(
      <>
        <Button variant="accent" ref={accent}>
          a
        </Button>
        <Button variant="open" ref={open}>
          o
        </Button>
      </>
    );
    expect(accent.current).toBe(screen.getByRole('button', { name: 'a' }));
    expect(open.current).toBe(screen.getByRole('button', { name: 'o' }));
  });
});

test('MobileMenuButton defaults to a black, medium, enabled button', () => {
  render(<MobileMenuButton>Menu</MobileMenuButton>);
  const button = screen.getByRole('button', { name: 'Menu' });
  expect(button).toHaveClass('text-on-surface', 'py-3', 'px-6');
  expect(button).toBeEnabled();
});

test('AddCancelActions labels the add button "Add" by default', () => {
  const onAdd = vi.fn<MouseEventHandler<HTMLButtonElement>>();
  const onCancel = vi.fn<MouseEventHandler<HTMLButtonElement>>();
  render(<AddCancelActions onAdd={onAdd} onCancel={onCancel} />);
  userEvent.click(screen.getByRole('button', { name: 'Add' }));
  userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
});

test('TransposeOption has no stray class when className is left out', () => {
  render(<TransposeOption>C</TransposeOption>);
  expect(screen.getByRole('button').className).not.toContain('undefined');
});

test('useDialog opens and closes', () => {
  function Dialog() {
    const [isOpen, show, close] = useDialog();
    return (
      <>
        <span>{isOpen ? 'open' : 'closed'}</span>
        <button onClick={show}>show</button>
        <button onClick={close}>close</button>
      </>
    );
  }
  render(<Dialog />);
  expect(screen.getByText('closed')).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'show' }));
  expect(screen.getByText('open')).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'close' }));
  expect(screen.getByText('closed')).toBeInTheDocument();
});

describe('Button colors and states (CAD-84)', () => {
  test('colors map to M3 roles by variant', () => {
    render(
      <>
        <Button color="red">filled</Button>
        <Button variant="accent" color="red">
          tonal
        </Button>
        <Button variant="open" color="gray">
          text
        </Button>
        <Button variant="outlined" color="purple">
          outlined
        </Button>
        <Button color="green">user</Button>
      </>
    );
    expect(screen.getByRole('button', { name: 'filled' })).toHaveClass(
      'bg-error',
      'text-on-error'
    );
    expect(screen.getByRole('button', { name: 'tonal' })).toHaveClass(
      'bg-error-container',
      'text-on-error-container'
    );
    expect(screen.getByRole('button', { name: 'text' })).toHaveClass(
      'text-on-surface-variant'
    );
    expect(screen.getByRole('button', { name: 'outlined' })).toHaveClass(
      'border',
      'border-outline-variant',
      'text-tertiary'
    );
    expect(screen.getByRole('button', { name: 'user' })).toHaveClass(
      'bg-user-green',
      'text-on-user-green'
    );
  });

  test('disabled buttons use on-surface at 12% and 38%', () => {
    render(
      <>
        <Button disabled>filled</Button>
        <Button variant="outlined" disabled>
          outlined
        </Button>
        <Button variant="icon" disabled>
          icon
        </Button>
      </>
    );
    const filled = screen.getByRole('button', { name: 'filled' });
    expect(filled).toBeDisabled();
    expect(filled).toHaveClass('bg-on-surface/12', 'text-on-surface/38');
    expect(filled).not.toHaveClass('bg-primary');
    expect(screen.getByRole('button', { name: 'outlined' })).toHaveClass(
      'border-on-surface/12',
      'text-on-surface/38'
    );
    expect(screen.getByRole('button', { name: 'icon' })).toHaveClass(
      'text-on-surface/38'
    );
  });

  test('a loading filled button keeps its colors', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });

  test('every variant has a state layer, focus ring and press morph', () => {
    render(
      <>
        <Button>a</Button>
        <Button variant="accent">b</Button>
        <Button variant="open">c</Button>
        <Button variant="outlined">d</Button>
        <Button variant="icon">e</Button>
      </>
    );
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass(
        'state-layer-flat',
        'focus-ring',
        'shape-morph'
      );
    }
  });

  test('sizes map to M3E XS, S and M', () => {
    render(
      <>
        <Button size="xs">xs</Button>
        <Button size="small">small</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
      </>
    );
    expect(screen.getByRole('button', { name: 'xs' })).toHaveClass('h-8');
    expect(screen.getByRole('button', { name: 'small' })).toHaveClass('h-10');
    expect(screen.getByRole('button', { name: 'md' })).toHaveClass(
      'h-14',
      'text-title-medium'
    );
    // No size of its own outside icon buttons: round, like before
    expect(screen.getByRole('button', { name: 'lg' })).toHaveClass(
      'rounded-full'
    );
  });
});

test('loading behaves as before: filled and tonal disable, text and outlined drop clicks', () => {
  const onClick = vi.fn<MouseEventHandler<HTMLButtonElement>>();
  render(
    <>
      <Button loading onClick={onClick}>
        filled
      </Button>
      <Button variant="accent" loading onClick={onClick}>
        tonal
      </Button>
      <Button variant="outlined" name="outlined" loading onClick={onClick}>
        x
      </Button>
    </>
  );
  const [filled, tonal] = screen.getAllByRole('button');
  expect(filled).toBeDisabled();
  expect(tonal).toBeDisabled();
  const outlined = screen.getByRole('button', { name: 'outlined' });
  expect(outlined).toBeEnabled();
  userEvent.click(outlined);
  expect(onClick).not.toHaveBeenCalled();
});

test("an icon button leaves display to the caller's className", () => {
  // SongDetailPage hides its print button with `hidden sm:block`
  render(
    <Button variant="icon" className="hidden sm:block">
      i
    </Button>
  );
  expect(screen.getByRole('button', { hidden: true }).className).not.toMatch(
    /\b(inline-flex|flex|inline-block|grid)\b/
  );
});

test('buttonClasses matches the filled and tonal buttons, for links', () => {
  render(
    <>
      <Button variant="filled" size="sm" className="gap-2">
        Filled
      </Button>
      <Button variant="accent" color="gray" size="md" full>
        Tonal
      </Button>
    </>
  );
  expect(screen.getByRole('button', { name: 'Filled' }).className).toBe(
    buttonClasses({ size: 'sm', className: 'gap-2' })
  );
  expect(screen.getByRole('button', { name: 'Tonal' }).className).toBe(
    buttonClasses({ variant: 'accent', color: 'gray', size: 'md', full: true })
  );
});
