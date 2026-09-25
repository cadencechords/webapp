import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { render } from '@testing-library/react';
import Icon from './Icon';
import { ICONS } from './icons/registry';

test('renders a decorative SVG sized and colored by CSS', () => {
  const { container } = render(
    <Icon name="delete" className="w-5 h-5 text-gray-600" />
  );
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg).toHaveAttribute('focusable', 'false');
  expect(svg).toHaveAttribute('fill', 'currentColor');
  expect(svg).toHaveClass('w-5', 'h-5', 'text-gray-600');
  expect(svg).not.toHaveAttribute('width');
});

test('filled uses the filled variant', () => {
  const outlined = render(<Icon name="check_circle" />).container.innerHTML;
  const filled = render(<Icon name="check_circle" filled />).container
    .innerHTML;
  expect(filled).not.toBe(outlined);
});

test('size sets width and height', () => {
  const svg = render(<Icon name="close" size={18} />).container.querySelector(
    'svg'
  );
  expect(svg.style.width).toBe('18px');
  expect(svg.style.height).toBe('18px');
});

test('unknown icons render nothing and warn', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  expect(render(<Icon name="not_an_icon" />).container.innerHTML).toBe('');
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});

test('every icon the app uses is registered, and no Heroicons remain', () => {
  const files = execSync(
    'grep -rhoE --exclude=*.test.js \'<Icon name="[a-z_0-9]+"( filled)?\' src || true'
  )
    .toString()
    .trim()
    .split('\n');
  for (const use of files) {
    const [, name, filled] = use.match(/name="([a-z_0-9]+)"( filled)?/);
    expect(ICONS[filled ? `${name}-fill` : name], use).toBeDefined();
  }
  expect(
    execSync('grep -rl --exclude=*.test.js "@heroicons" src || true').toString()
  ).toBe('');
  expect(
    JSON.parse(readFileSync('package.json', 'utf8')).dependencies[
      '@heroicons/react'
    ]
  ).toBeUndefined();
});
