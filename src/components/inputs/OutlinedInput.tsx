import Label from '../Label';
import PulseLoader from 'react-spinners/PulseLoader';
import {
  forwardRef,
  type FocusEventHandler,
  type HTMLInputTypeAttribute,
  type KeyboardEvent,
  type MouseEventHandler,
  type ReactNode,
} from 'react';

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
  className?: string;
  onEnter?: () => void;
  id?: string;
};

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
    },
    ref
  ) => {
    const roundedClasses = ' rounded-lg ';

    const handleOnKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        onEnter?.();
      }
    };

    return (
      <>
        {label && <Label>{label}</Label>}
        <div className="flex gap-2">
          <input
            id={id}
            className={`dark:bg-dark-gray-700 appearance-none transition-all px-3 py-2 shadow-xs border-gray-300 dark:border-dark-gray-400 focus:outline-hidden outline-hidden w-full border ${roundedClasses}  focus:ring-offset-1 focus:ring-2 focus:ring-blue-400 dark:focus:ring-offset-dark-gray-700 ${className}`}
            placeholder={placeholder}
            onBlur={onBlur}
            onFocus={onFocus}
            type={type}
            onChange={e => onChange(e.target.value)}
            autoComplete="off"
            value={value}
            autoCapitalize="off"
            pattern={type.toLowerCase() === 'date' ? 'd{4}-d{2}-d{2}' : ''}
            onKeyUp={handleOnKeyUp}
            ref={ref}
          />

          {button && (
            <button
              className={
                'rounded-lg border-gray-300 dark:border-dark-gray-400 border px-2 bg-gray-50 dark:bg-dark-gray-400 ' +
                ' focus:outline-hidden outline-hidden transition-all font-semibold text-sm ' +
                ' text-gray-600 dark:text-dark-gray-200 ' +
                `${
                  buttonLoading
                    ? ' w-20 cursor-wait '
                    : ' hover:bg-gray-200 focus:bg-gray-200'
                }`
              }
              onClick={!buttonLoading ? onButtonClick : undefined}
            >
              {buttonLoading ? <PulseLoader size={4} color="gray" /> : button}
            </button>
          )}
        </div>
      </>
    );
  }
);

export default OutlinedInput;
