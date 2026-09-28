import { useState, type ComponentProps } from 'react';
import Icon from '../Icon';
import OutlinedInput from './OutlinedInput';

type PasswordInputProps = Omit<
  ComponentProps<typeof OutlinedInput>,
  'type' | 'trailing'
>;

// An outlined text field for a password, with a trailing button that shows
// or hides it.
export default function PasswordInput(props: PasswordInputProps) {
  const [shown, setShown] = useState(false);
  return (
    <OutlinedInput
      {...props}
      type={shown ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          aria-label={shown ? 'Hide password' : 'Show password'}
          aria-pressed={shown}
          onClick={() => setShown(!shown)}
          className="flex-center w-10 h-10 rounded-full text-on-surface-variant state-layer-flat focus-ring"
        >
          <Icon
            name={shown ? 'visibility_off' : 'visibility'}
            className="w-6 h-6"
          />
        </button>
      }
    />
  );
}
