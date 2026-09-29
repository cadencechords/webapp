import type { ReactNode } from 'react';
import mezzoMark from '../assets/mezzo-mark.svg';

/** An M3 text button, as a link. */
export const TEXT_LINK =
  'inline-flex items-center h-10 px-3 rounded-[20px] font-plain text-label-large text-primary state-layer-flat focus-ring';

/** An M3E filled button (medium, full width), as a link. */
export const FILLED_LINK =
  'flex-center w-full h-14 px-6 rounded-[28px] font-plain text-title-medium bg-primary text-on-primary state-layer-flat focus-ring';

type AuthPageProps = {
  title: string;
  description: ReactNode;
  /** The page's form; left out when there's nothing to fill in. */
  children?: ReactNode;
  /** Under the card's content, e.g. a link to the other auth page. */
  footer?: ReactNode;
};

// The shell of the signed-out pages: the Mezzo mark, a display headline and
// the page's form. Full-bleed on phones; from sm up, a card on
// surface-container.
export default function AuthPage({
  title,
  description,
  children,
  footer,
}: AuthPageProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10 bg-surface sm:bg-surface-container">
      <div className="w-full max-w-md animate-enter-rise sm:p-10 sm:rounded-extra-large-increased sm:bg-surface">
        <img src={mezzoMark} alt="Mezzo" className="w-auto h-16 mb-6" />
        <h1 className="font-brand text-display-small text-on-surface">
          {title}
        </h1>
        <p className="mt-2 font-plain text-body-large text-on-surface-variant">
          {description}
        </p>
        {children && <div className="mt-8">{children}</div>}
        {footer && (
          <div className="flex flex-wrap items-center justify-center gap-1 mt-6 font-plain text-body-medium text-on-surface-variant">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
