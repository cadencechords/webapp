import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button';
import AddCancelActions from './buttons/AddCancelActions';
import MobileMenuButton from './buttons/MobileMenuButton';
import SidenavLink from './SidenavLink';
import TransposeOption from './TransposeOption';
import useDialog from '../hooks/useDialog';

// These pin the defaults that used to live in defaultProps (CAD-118).

describe('Button', () => {
  test('defaults to a small blue filled button', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('px-3', 'h-9', 'bg-blue-600', 'text-white');
    expect(button).not.toHaveClass('w-full');
    expect(button).toBeEnabled();
  });

  test('a loading filled button is disabled and hides its label', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  test('open variant: bold, labelled by name, no clicks while loading', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <Button variant="open" name="Close" onClick={onClick}>
        x
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Close' });
    expect(button).toHaveClass('font-semibold', 'text-blue-600', 'px-3');
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
    expect(screen.getByRole('button')).toHaveClass('p-1', 'text-blue-600');
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
  expect(button).toHaveClass('text-black', 'py-3', 'px-6');
  expect(button).toBeEnabled();
});

test('AddCancelActions labels the add button "Add" by default', () => {
  const onAdd = vi.fn();
  const onCancel = vi.fn();
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

test('SidenavLink matches nested routes unless exact', () => {
  const { rerender } = render(
    <MemoryRouter initialEntries={['/songs/1']}>
      <SidenavLink to="/songs" text="Songs" />
    </MemoryRouter>
  );
  expect(screen.getByRole('link')).toHaveClass('text-blue-700');

  rerender(
    <MemoryRouter initialEntries={['/songs/1']}>
      <SidenavLink to="/songs" text="Songs" exact />
    </MemoryRouter>
  );
  expect(screen.getByRole('link')).not.toHaveClass('text-blue-700');
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
