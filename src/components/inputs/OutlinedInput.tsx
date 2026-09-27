import classNames from 'classnames';
import {
  forwardRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FocusEventHandler,
  type HTMLInputTypeAttribute,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import LoadingIndicator from '../feedback/LoadingIndicator';

type OutlinedInputProps = {
  placeholder?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  type?: HTMLInputTypeAttribute;
  onChange: (value: string) => void;
  value?: string | number;
  label?: ReactNode;
  button?: ReactNode;
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  buttonLoading?: boolean;
  /** Classes for the field (margins, width); the outline follows it. */
  className?: string;
  onEnter?: () => void;
  id?: string;
  /** Help text under the field. */
  supportingText?: ReactNode;
  /** An error message under the field; shows the field in the error color. */
  error?: ReactNode;
};

// Types whose empty value still shows a format (mm/dd/yyyy, --:--), so the
// label can't rest inside the field.
const FORMATTED_TYPES = ['date', 'time', 'datetime-local', 'month', 'week'];

let nextId = 0;

// M3 outlined text field. The outline is a fieldset whose legend cuts the
// notch the floating label sits in, so it works on any background.
const OutlinedInput = forwardRef<HTMLInputElement, OutlinedInputProps>(
  (
    {
      placeholder,
      onBlur,
      onFocus,
      type = 'text',
      onChange,
      value,
      label,
      button,
      onButtonClick,
      buttonLoading,
      className,
      onEnter,
      id,
      supportingText,
      error,
    },
    ref
  ) => {
    const [generatedId] = useState(() => `outlined-input-${++nextId}`);
    const inputId = id || generatedId;
    const [focused, setFocused] = useState(false);
    // For callers that don't pass a value: what's been typed.
    const [typed, setTyped] = useState('');

    const hasValue = value === undefined ? typed !== '' : `${value}` !== '';
    const floated =
      !label ||
      focused ||
      hasValue ||
      !!placeholder ||
      FORMATTED_TYPES.includes(type.toLowerCase());
    // An empty message ('' when valid) isn't an error.
    const hasError = !!error;
    const helpText = hasError ? error : supportingText;

    const handleOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        onEnter?.();
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setTyped(e.target.value);
      onChange(e.target.value);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <div>
        <div className="flex gap-2">
          <div
            className={classNames(
              'relative flex flex-1 min-w-0 min-h-12 font-plain',
              className
            )}
          >
            <input
              id={inputId}
              className={classNames(
                'peer w-full min-w-0 self-stretch px-4 py-3 bg-transparent appearance-none outline-hidden focus:outline-hidden',
                'text-body-large text-on-surface placeholder:text-on-surface-variant dark:scheme-dark',
                hasError ? 'caret-error' : 'caret-primary'
              )}
              placeholder={placeholder}
              onBlur={handleBlur}
              onFocus={handleFocus}
              type={type}
              onChange={handleChange}
              autoComplete="off"
              value={value}
              autoCapitalize="off"
              pattern={type.toLowerCase() === 'date' ? 'd{4}-d{2}-d{2}' : ''}
              onKeyUp={handleOnKeyUp}
              aria-invalid={hasError || undefined}
              aria-describedby={helpText ? `${inputId}-help` : undefined}
              ref={ref}
            />
            <fieldset
              aria-hidden="true"
              className={classNames(
                'absolute inset-x-0 bottom-0 -top-[5px] m-0 px-3 min-w-0 text-left rounded-extra-small pointer-events-none transition-fast-effects',
                focused ? 'border-2' : 'border',
                hasError
                  ? 'border-error'
                  : focused
                    ? 'border-primary'
                    : 'border-outline peer-hover:border-on-surface'
              )}
            >
              {/* Always rendered: the fieldset's -5px top lines its border
                  up with the middle of this 11px legend. */}
              <legend
                className={classNames(
                  'invisible h-[11px] p-0 text-body-small whitespace-nowrap overflow-hidden',
                  label && floated ? 'max-w-full' : 'max-w-[0.01px]'
                )}
              >
                {label && <span className="px-1">{label}</span>}
              </legend>
            </fieldset>
            {label && (
              <label
                htmlFor={inputId}
                className={classNames(
                  'absolute left-4 top-0 max-w-[calc(100%-2rem)] truncate origin-top-left pointer-events-none text-body-large transition-fast-spatial',
                  // Floated: 24px line at 75% is 18px, centered on the outline
                  floated
                    ? '-translate-y-[9px] scale-75'
                    : 'translate-y-3 scale-100',
                  hasError
                    ? 'text-error'
                    : focused
                      ? 'text-primary'
                      : 'text-on-surface-variant'
                )}
              >
                {label}
              </label>
            )}
          </div>

          {button && (
            <button
              className={classNames(
                'min-h-12 px-4 rounded-full font-plain text-label-large state-layer-flat focus-ring',
                'bg-secondary-container text-on-secondary-container',
                buttonLoading ? 'w-20 cursor-wait' : ''
              )}
              onClick={!buttonLoading ? onButtonClick : undefined}
            >
              {buttonLoading ? (
                <LoadingIndicator size={24} color="inherit" />
              ) : (
                button
              )}
            </button>
          )}
        </div>
        {helpText && (
          <div
            id={`${inputId}-help`}
            className={classNames(
              'px-4 pt-1 font-plain text-body-small',
              hasError ? 'text-error' : 'text-on-surface-variant'
            )}
          >
            {helpText}
          </div>
        )}
      </div>
    );
  }
);

export default OutlinedInput;
