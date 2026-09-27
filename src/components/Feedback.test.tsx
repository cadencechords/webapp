import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import Alert from './Alert';
import OrDivider from './OrDivider';
import PageTitle from './PageTitle';
import SectionTitle from './SectionTitle';

describe('Alert', () => {
  test.each([
    ['red', 'bg-error-container', 'text-on-error-container'],
    ['yellow', 'bg-tertiary-container', 'text-on-tertiary-container'],
    ['green', 'bg-tertiary-container', 'text-on-tertiary-container'],
    ['blue', 'bg-secondary-container', 'text-on-secondary-container'],
    ['gray', 'bg-surface-container-highest', 'text-on-surface-variant'],
  ] as const)('%s is a %s banner', (color, container, text) => {
    render(<Alert color={color}>Message</Alert>);
    const banner = screen.getByText('Message').parentElement as HTMLElement;
    expect(banner).toHaveClass(container, text, 'rounded-medium');
    // A decorative leading icon: screen readers read the message alone.
    expect(banner.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  test('keeps its className and dismisses from a labelled button', () => {
    const onDismiss = vi.fn<() => void>();
    render(
      <Alert color="red" dismissable onDismiss={onDismiss} className="mb-6">
        Wrong password
      </Alert>
    );
    expect(screen.getByText('Wrong password').parentElement).toHaveClass(
      'mb-6'
    );
    userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

test('PageTitle: editable titles are inputs in the same type', () => {
  const onChange = vi.fn<(title: string) => void>();
  render(<PageTitle title="Setlist" editable onChange={onChange} />);
  const input = screen.getByRole('textbox');
  expect(input).toHaveClass(
    'text-headline-small-emphasized',
    'state-layer-flat',
    'focus:bg-surface-container-highest'
  );
  userEvent.type(input, '!');
  expect(onChange).toHaveBeenLastCalledWith('Setlist!');
});

test('PageTitle aligns center and right', () => {
  const { rerender } = render(<PageTitle title="Sign in" align="center" />);
  expect(screen.getByRole('heading')).toHaveClass('justify-center');
  rerender(<PageTitle title="Sign in" align="right" />);
  expect(screen.getByRole('heading')).toHaveClass('justify-end');
});

test('SectionTitle is title-large, over a divider when underlined', () => {
  const { rerender } = render(<SectionTitle title="Members" />);
  const heading = screen.getByRole('heading', { name: 'Members' });
  expect(heading).toHaveClass('text-title-large', 'text-on-surface');
  expect(heading).not.toHaveClass('border-b');
  rerender(<SectionTitle title="Members" underline />);
  expect(heading).toHaveClass('border-b', 'border-outline-variant');
});

test('OrDivider is label-medium between outline-variant rules', () => {
  const { container } = render(<OrDivider />);
  expect(container.firstElementChild).toHaveClass(
    'text-label-medium',
    'text-on-surface-variant'
  );
  const rules = container.querySelectorAll('hr');
  expect(rules).toHaveLength(2);
  rules.forEach(rule => expect(rule).toHaveClass('border-outline-variant'));
});

describe('CSS', () => {
  let css: string;
  beforeAll(async () => {
    const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
      base: path.resolve('src'),
      onDependency: () => {},
    });
    css = compiler.build(['subtext', 'section-border']);
  });

  test('toasts are inverse-surface snackbars with extra-small corners', () => {
    expect(css).toMatch(
      /\.Toastify \{[^}]*--toastify-color-light: var\(--md-sys-color-inverse-surface\)/
    );
    expect(css).toMatch(
      /\.Toastify \{[^}]*--toastify-text-color-light: var\(--md-sys-color-inverse-on-surface\)/
    );
    expect(css).toMatch(
      /\.Toastify \.Toastify__toast \{[^}]*border-radius: var\(--md-sys-shape-corner-extra-small\)/
    );
    // toast.loading's spinner stays; the status icons go.
    expect(css).toMatch(
      /\.Toastify__toast-icon:not\(:has\(\.Toastify__spinner\)\) \{\s*display: none/
    );
    expect(css).toMatch(
      /--toastify-spinner-color: var\(--md-sys-color-inverse-primary\)/
    );
  });

  test('.subtext and .section-border use the color tokens', () => {
    expect(css).toMatch(
      /\.subtext \{\s*color: var\(--md-sys-color-on-surface-variant\)/
    );
    expect(css).toMatch(
      /\.section-border \{[^}]*border-color: var\(--md-sys-color-outline-variant\)/
    );
  });
});
