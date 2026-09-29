import type {
  HTMLInputTypeAttribute,
  MouseEventHandler,
  ReactNode,
} from 'react';

type EditableDataProps = {
  // Text when editable; anything renderable (e.g. a link) when not.
  value?: ReactNode;
  onChange?: (value: string) => void;
  placeholder?: string;
  centered?: boolean;
  onClick?: MouseEventHandler<HTMLInputElement>;
  className?: string;
  type?: HTMLInputTypeAttribute;
  editable?: boolean;
};

export default function EditableData({
  value,
  onChange,
  placeholder,
  centered = false,
  onClick,
  className,
  type = 'text',
  editable = true,
}: EditableDataProps) {
  if (editable) {
    return (
      <input
        className={
          `appearance-none p-1 w-full sm:text-sm text-base outline-hidden focus:outline-hidden ` +
          ` text-on-surface placeholder:text-on-surface-variant caret-primary hover:bg-surface-container-highest focus:bg-surface-container-highest focus:shadow-[inset_0_-2px_0_var(--color-primary)] rounded-t-extra-small bg-transparent transition-fast-effects ` +
          ` ${centered ? ' text-center ' : ''}` +
          ` ${className} `
        }
        value={value as string | number | undefined}
        // Kept as before: MeterField's editable input passes no onChange (it
        // opens a dialog on click), so typing there throws.
        onChange={e => onChange!(e.target.value)}
        placeholder={placeholder}
        onClick={onClick}
        type={type}
      />
    );
  } else {
    return (
      <div className="p-1 w-full sm:text-sm text-base text-on-surface">
        {value || 'None provided'}
      </div>
    );
  }
}
