import { useState } from 'react';
import classNames from 'classnames';
import Icon from './Icon';
import Toggle from './Toggle';

type ShareLinkCardProps = {
  /** "Join link", "Public link": the card's title and the switch's name. */
  title: string;
  /** Who the link is for, under the title. */
  description: string;
  link: string;
  enabled: boolean;
  /** Turns the link on or off. Without it, there's no switch. */
  onToggle?: () => void;
  className?: string;
};

// A shareable link on an M3E card: a title and switch, then the link in a
// field with a quiet text Copy button. Turned off, the link dims and can't
// be copied. The team's join link and a set's public link use it.
export default function ShareLinkCard({
  title,
  description,
  link,
  enabled,
  onToggle,
  className,
}: ShareLinkCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(link);
    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <section
      className={classNames(
        'flex flex-col gap-4 p-5 rounded-extra-large bg-surface-container-low text-on-surface font-plain',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-center shrink-0 w-10 h-10 rounded-full bg-primary-container text-on-primary-container">
          <Icon name="link" className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-title-medium">{title}</h2>
          <p className="text-body-medium text-on-surface-variant">
            {description}
          </p>
        </div>
        {onToggle && (
          <Toggle
            enabled={enabled}
            onChange={onToggle}
            label={<span className="sr-only">{title}</span>}
          />
        )}
      </div>
      <div className="flex items-center gap-2 pl-4 pr-1 h-12 rounded-full bg-surface-container-highest">
        <span
          className={classNames(
            'flex-1 min-w-0 truncate select-all text-body-medium',
            enabled ? 'text-on-surface' : 'text-on-surface/38'
          )}
        >
          {link}
        </span>
        <button
          type="button"
          onClick={handleCopyToClipboard}
          disabled={!enabled || copied}
          // M3E small text button: primary content, no container.
          className="flex-center gap-2 shrink-0 h-10 px-3 rounded-[20px] [--shape-morph-to:8px] text-primary text-label-large state-layer-flat focus-ring shape-morph disabled:text-on-surface/38 disabled:cursor-default"
        >
          <Icon name={copied ? 'check' : 'content_copy'} className="w-5 h-5" />
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </section>
  );
}
