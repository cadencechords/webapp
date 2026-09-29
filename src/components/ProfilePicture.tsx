import classNames from 'classnames';
import type { MouseEventHandler } from 'react';
import Icon from './Icon';

type ProfilePictureProps = {
  url?: string | null;
  size?: keyof typeof SIZES;
  onClick?: MouseEventHandler<HTMLDivElement>;
  /** Whose picture it is (a person's name or email, or a team's name): with
      no `url`, its initials show instead. */
  name?: string | null;
};

// A circular avatar: the picture, or a monogram on primary-container, or a
// person icon when there's no name either.
export default function ProfilePicture({
  url,
  size = 'base',
  onClick,
  name,
}: ProfilePictureProps) {
  const initials = monogram(name);
  const clickable =
    onClick && 'cursor-pointer hover:opacity-90 transition-opacity';

  if (url) {
    return (
      <div
        style={{ width: SIZES[size], height: SIZES[size] }}
        onClick={onClick}
      >
        <div
          className={classNames(
            'w-full h-full rounded-full bg-surface-container-highest',
            clickable
          )}
          style={{
            backgroundImage: `url('${url}')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        ></div>
      </div>
    );
  } else if (initials) {
    return (
      <div
        style={{
          width: SIZES[size],
          height: SIZES[size],
          fontSize: `calc(${SIZES[size]} * 0.4)`,
        }}
        className={classNames(
          'flex-center shrink-0 rounded-full bg-primary-container text-on-primary-container font-plain font-medium leading-none select-none',
          clickable
        )}
        onClick={onClick}
        aria-hidden="true"
      >
        {initials}
      </div>
    );
  } else {
    return (
      <div
        style={{ width: SIZES[size], height: SIZES[size] }}
        className={classNames('flex-center', clickable)}
        onClick={onClick}
      >
        <Icon
          name="account_circle"
          className="w-full h-full text-on-surface-variant"
        />
      </div>
    );
  }
}

/** Up to two initials: "Ada Lovelace" is "AL", "ada@example.com" is "A". */
export function monogram(name?: string | null) {
  const trimmed = name?.trim();
  if (!trimmed) return '';
  if (trimmed.includes('@')) return trimmed[0].toUpperCase();
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map(word => [...word][0])
    .join('')
    .toUpperCase();
}

const SIZES = {
  xxs: '18px',
  xs: '30px',
  md: '40px',
  sm: '50px',
  base: '70px',
  lg: '90px',
  xl: '110px',
  xl2: '130px',
};
