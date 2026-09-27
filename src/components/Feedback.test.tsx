import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { toast } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import Alert from './Alert';
import Button from './Button';
import LinearProgress, {
  bezier,
  segments,
  wavePath,
} from './feedback/LinearProgress';
import LoadingIndicator from './feedback/LoadingIndicator';
import Snackbars from './feedback/Snackbars';
import Icon from './Icon';
import OutlinedInput from './inputs/OutlinedInput';
import {
  LoadingAnimator,
  SHAPE_COUNT,
  SHAPE_PATHS,
  getShapes,
  morphedShape,
  toPath,
} from './feedback/loadingShapes';
import NoDataMessage from './NoDataMessage';
import PageLoading from './PageLoading';
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

  test.each([
    ['red', 'error'],
    ['yellow', 'warning'],
    ['green', 'check_circle'],
    ['blue', 'info'],
    ['gray', 'info'],
  ] as const)('%s leads with the %s icon', (color, icon) => {
    // yellow and green share tertiary-container: the icon tells them apart.
    render(<Alert color={color}>Message</Alert>);
    const svg = screen.getByText('Message').parentElement?.querySelector('svg');
    const expected = document.createElement('div');
    expected.innerHTML = renderToStaticMarkup(<Icon name={icon} />);
    expect(svg?.innerHTML).toBe(expected.firstElementChild?.innerHTML);
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

  test('snackbars sit above the mobile nav, inset on phones', () => {
    expect(css).toMatch(
      /@media \(max-width: 767px\) \{\s*\.Toastify \.Toastify__toast-container--bottom-center \{\s*bottom: 3\.5rem/
    );
    expect(css).toMatch(
      /@media only screen and \(max-width: 480px\) \{\s*\.Toastify \.Toastify__toast-container \{\s*width: auto;\s*left: 1rem;\s*right: 1rem/
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

describe('loading shapes', () => {
  test('every shape is the same number of points, centered and within -1..1', () => {
    const shapes = getShapes();
    expect(shapes).toHaveLength(SHAPE_COUNT);
    expect(SHAPE_COUNT).toBe(7);
    for (const shape of shapes) {
      expect(shape).toHaveLength(shapes[0].length);
      const xs = shape.map(([x]) => x);
      const ys = shape.map(([, y]) => y);
      expect(Math.min(...xs)).toBeGreaterThanOrEqual(-1.0001);
      expect(Math.max(...xs)).toBeLessThanOrEqual(1.0001);
      expect(Math.min(...ys)).toBeGreaterThanOrEqual(-1.0001);
      expect(Math.max(...ys)).toBeLessThanOrEqual(1.0001);
      // It fills the box one way or the other.
      expect(
        Math.max(
          Math.max(...xs) - Math.min(...xs),
          Math.max(...ys) - Math.min(...ys)
        )
      ).toBeCloseTo(2, 1);
    }
  });

  test('morphedShape interpolates between neighbours and wraps around', () => {
    const shapes = getShapes();
    expect(morphedShape(0)).toEqual(shapes[0]);
    expect(morphedShape(1)).toEqual(shapes[1]);
    expect(morphedShape(SHAPE_COUNT)).toEqual(shapes[0]);
    const [x, y] = morphedShape(0.5)[10];
    expect(x).toBeCloseTo((shapes[0][10][0] + shapes[1][10][0]) / 2);
    expect(y).toBeCloseTo((shapes[0][10][1] + shapes[1][10][1]) / 2);
  });

  test('shapes keep their size through every morph', () => {
    // Every outline starts straight up: a morph between outlines starting at
    // different angles drags points across the shape and shrinks it.
    const meanRadius = (points: [number, number][]) =>
      points.reduce((sum, [x, y]) => sum + Math.hypot(x, y), 0) / points.length;
    const shapes = getShapes();
    for (let i = 0; i < SHAPE_COUNT; i++) {
      const ends =
        (meanRadius(shapes[i]) + meanRadius(shapes[(i + 1) % SHAPE_COUNT])) / 2;
      expect(meanRadius(morphedShape(i + 0.5))).toBeGreaterThan(ends * 0.9);
      expect(shapes[i][0][0]).toBeCloseTo(0, 1);
      expect(shapes[i][0][1]).toBeLessThan(0);
    }
  });

  test('toPath draws a closed path at the given scale', () => {
    expect(
      toPath(
        [
          [1, 0],
          [0, -0.5],
        ],
        10
      )
    ).toBe('M10.00 0.00L0.00 -5.00Z');
  });

  test('the animator starts a new shape at 650ms, and turns without jumps', () => {
    const animator = new LoadingAnimator();
    let now = 0;
    animator.update(now);
    let previous = animator.rotation;
    let largestTurn = 0;
    const morphAt: Record<number, number> = {};
    // 1ms frames for 2s: the morph's target moves on at 650ms and 1300ms.
    for (let ms = 1; ms <= 2000; ms++) {
      animator.update((now += 1));
      const turn = Math.abs(animator.rotation - previous);
      largestTurn = Math.max(largestTurn, Math.min(turn, 360 - turn));
      previous = animator.rotation;
      morphAt[ms] = animator.morph;
    }
    // Settled on the way to the second shape just before 650ms, heading for
    // the third after it, and so on.
    expect(morphAt[649]).toBeLessThan(1.2);
    expect(morphAt[900]).toBeGreaterThan(1.5);
    expect(morphAt[1299]).toBeLessThan(2.2);
    expect(morphAt[1550]).toBeGreaterThan(2.5);
    expect(largestTurn).toBeLessThan(2);
  });

  test('the animator moves on a shape every 650ms, on an overshooting spring', () => {
    const animator = new LoadingAnimator();
    let now = 1000;
    animator.update(now);
    const morphs: number[] = [];
    for (let frame = 0; frame < 39; frame++) {
      now += 1000 / 60;
      animator.update(now);
      morphs.push(animator.morph);
    }
    // 650ms in: past the first shape (the spring overshoots), and turning.
    expect(Math.max(...morphs)).toBeGreaterThan(1);
    expect(animator.rotation).toBeGreaterThan(0);
    for (let frame = 0; frame < 60; frame++) {
      now += 1000 / 60;
      animator.update(now);
    }
    // About 1.65s in: settling on the third shape's way to the fourth.
    expect(animator.morph).toBeGreaterThan(1.5);
    expect(animator.morph).toBeLessThan(3.5);
  });
});

describe('LoadingIndicator', () => {
  function runFrames(count: number, step = 1000 / 60) {
    const frames: FrameRequestCallback[] = [];
    let id = 0;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      frames.push(callback);
      return ++id;
    });
    return () => {
      let now = 0;
      for (let i = 0; i < count; i++) {
        const frame = frames.shift();
        act(() => frame?.((now += step)));
      }
    };
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('is decorative, primary, and morphs while it turns', () => {
    const run = runFrames(40);
    const { container } = render(<LoadingIndicator />);
    const svg = container.querySelector('svg') as SVGSVGElement;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '48');
    expect(svg).toHaveClass('text-primary');
    const path = svg.querySelector('path') as SVGPathElement;
    const first = path.getAttribute('d');
    run();
    expect(path.getAttribute('d')).not.toBe(first);
    expect(path.getAttribute('transform')).toMatch(/^rotate\(\d/);
  });

  test('contained: on-primary-container in a primary-container circle', () => {
    const { container } = render(<LoadingIndicator contained size={40} />);
    expect(container.querySelector('svg')).toHaveClass(
      'text-on-primary-container'
    );
    expect(container.querySelector('circle')).toHaveClass(
      'fill-primary-container'
    );
    expect(container.querySelector('circle')).toHaveAttribute('r', '20');
  });

  test('color="inherit" takes the text color, as in a button', () => {
    const { container } = render(<LoadingIndicator color="inherit" />);
    expect(container.querySelector('svg')?.getAttribute('class')).not.toMatch(
      /text-/
    );
  });

  test('with reduced motion it keeps its shape and only turns', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      query =>
        ({
          matches: query === '(prefers-reduced-motion: reduce)',
        }) as MediaQueryList
    );
    const run = runFrames(40);
    const { container } = render(<LoadingIndicator />);
    const path = container.querySelector('path') as SVGPathElement;
    const first = path.getAttribute('d');
    run();
    expect(path.getAttribute('d')).toBe(first);
    expect(path.getAttribute('transform')).not.toBe('rotate(0.00)');
  });

  test('stops animating when it unmounts', () => {
    const run = runFrames(5);
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<LoadingIndicator />);
    run();
    unmount();
    // The frame it scheduled last, not a stale one.
    const latest = vi.mocked(window.requestAnimationFrame).mock.results.at(-1)
      ?.value as number;
    expect(latest).toBeGreaterThan(1);
    expect(cancel).toHaveBeenCalledWith(latest);
  });
});

describe('LinearProgress', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('bezier matches CSS easing at its ends and midpoint', () => {
    const linear = bezier(0, 0, 1, 1);
    expect(linear(0.3)).toBeCloseTo(0.3, 2);
    const ease = bezier(0.4, 0, 0.2, 1);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBeGreaterThan(0.5);
  });

  test('two segments chase along an 1800ms cycle', () => {
    expect(segments(0)).toEqual([
      [0, 0],
      [0, 0],
    ]);
    const [[tail, head]] = segments(500);
    expect(head).toBeGreaterThan(tail);
    // The second segment starts at 1000ms, and the cycle repeats.
    expect(segments(900)[1]).toEqual([0, 0]);
    expect(segments(1400)[1][1]).toBeGreaterThan(0);
    expect(segments(1800 + 500)).toEqual(segments(500));
  });

  test('wavePath is flat without amplitude and waves with it', () => {
    expect(wavePath(0, 10, 2, 0, 0)).toBe('M0.00 2.00L10.00 2.00');
    expect(wavePath(0, 0.2, 2, 0, 0)).toBe('');
    const wave = wavePath(0, 20, 2, 3, 0);
    const ys = [...wave.matchAll(/ (-?[\d.]+)/g)].map(match =>
      Number(match[1])
    );
    expect(Math.max(...ys)).toBeGreaterThan(4);
  });

  test('is decorative and draws once it has a width', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    const { container } = render(<LinearProgress />);
    const box = container.firstElementChild as HTMLElement;
    expect(box).toHaveAttribute('aria-hidden', 'true');
    expect(box.querySelector('svg')).toHaveAttribute('width', '200');
    expect(box.querySelectorAll('path')[0]).toHaveClass(
      'stroke-secondary-container'
    );
    expect(box.querySelectorAll('path')[1]).toHaveClass('stroke-primary');
  });

  test('stops animating when it unmounts', () => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(200);
    const frames: FrameRequestCallback[] = [];
    const request = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(callback => frames.push(callback));
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = render(<LinearProgress />);
    for (let i = 1; i <= 3; i++) act(() => frames[frames.length - 1](i * 16));
    unmount();
    const latest = request.mock.results.at(-1)?.value as number;
    expect(latest).toBeGreaterThan(1);
    expect(cancel).toHaveBeenCalledWith(latest);
  });
});

describe('NoDataMessage', () => {
  test('an icon in a cookie over a headline-small message', () => {
    const { container } = render(<NoDataMessage type="songs" />);
    const message = screen.getByText('No songs to show');
    expect(message).toHaveClass('text-headline-small', 'text-on-surface');
    const cookie = container.querySelector('svg.fill-primary-container');
    expect(cookie?.querySelector('path')).toHaveAttribute(
      'd',
      SHAPE_PATHS[1]?.d
    );
  });

  test('children replace the message; description goes under it', () => {
    render(
      <NoDataMessage description={<button>Go back</button>}>
        This set has no songs
      </NoDataMessage>
    );
    expect(screen.getByText('This set has no songs')).toHaveClass(
      'text-headline-small'
    );
    expect(
      screen.getByRole('button', { name: 'Go back' }).parentElement
    ).toHaveClass('text-body-medium');
  });

  test('compact: one body-medium line beside a small cookie', () => {
    const { container } = render(
      <NoDataMessage compact>No binders found</NoDataMessage>
    );
    expect(screen.getByText('No binders found').parentElement).toHaveClass(
      'text-body-medium',
      'text-on-surface-variant'
    );
    expect(container.querySelector('.text-headline-small')).toBeNull();
    expect(
      container.querySelector('svg.fill-primary-container')?.parentElement
    ).toHaveClass('w-10', 'h-10');
  });

  test('shows the loading indicator while loading', () => {
    const { container } = render(<NoDataMessage loading type="files" />);
    expect(container.querySelector('[data-loading-indicator]')).not.toBeNull();
    expect(screen.queryByText('No files to show')).not.toBeInTheDocument();
  });
});

test('PageLoading shows its message over the loading indicator', () => {
  const { container } = render(<PageLoading>Please wait...</PageLoading>);
  expect(screen.getByText('Please wait...')).toBeInTheDocument();
  expect(container.querySelector('[data-loading-indicator]')).not.toBeNull();
});

test('Snackbars: bottom-centered, without the progress bar, as alerts', async () => {
  render(<Snackbars />);
  act(() => {
    toast('Host ended session');
  });
  const message = await screen.findByText('Host ended session');
  expect(message.closest('.Toastify__toast-container')).toHaveClass(
    'Toastify__toast-container--bottom-center'
  );
  expect(message.closest('[role="alert"]')).not.toBeNull();
  // hideProgressBar keeps the timer bar (it drives autoClose) but hides it.
  expect(document.querySelector('.Toastify__progress-bar')).toHaveAttribute(
    'aria-hidden',
    'true'
  );
});

test('OutlinedInput shows the indicator in its button while loading', () => {
  const { container } = render(
    <OutlinedInput value="" onChange={() => {}} button="Join" buttonLoading />
  );
  expect(screen.queryByText('Join')).not.toBeInTheDocument();
  const indicator = container.querySelector('[data-loading-indicator]');
  expect(indicator).toHaveAttribute('width', '24');
  expect(indicator?.getAttribute('class')).not.toMatch(/text-primary/);
});

test.each(['filled', 'accent', 'open'] as const)(
  'a loading %s Button shows an inline indicator, centered by the button',
  variant => {
    const { container } = render(
      <Button variant={variant} loading full>
        Save
      </Button>
    );
    const indicator = container.querySelector('[data-loading-indicator]');
    expect(indicator).toHaveClass('inline-block');
    expect(indicator).toHaveAttribute('width', '24');
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  }
);

test('a loading Button shows the indicator in its own text color', () => {
  const { container } = render(<Button loading>Save</Button>);
  expect(screen.queryByText('Save')).not.toBeInTheDocument();
  const indicator = container.querySelector('[data-loading-indicator]');
  expect(indicator).toHaveAttribute('width', '24');
  expect(indicator?.getAttribute('class')).not.toMatch(/text-primary/);
});
