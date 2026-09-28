import classNames from 'classnames';
import Icon from './Icon';

type PasswordRequirementsProps = {
  isLongEnough?: boolean;
  isUncommon?: boolean;
};

// What a new password needs, as supporting text under its field: each rule
// gets a primary check once it's met.
export default function PasswordRequirements({
  isLongEnough = false,
  isUncommon = false,
}: PasswordRequirementsProps) {
  const rules = [
    { met: isLongEnough, text: 'At least 8 characters' },
    { met: isUncommon, text: 'Not a common password' },
  ];
  return (
    <ul
      aria-label="Password requirements"
      className="flex flex-col gap-1 px-4 font-plain text-body-small text-on-surface-variant"
    >
      {rules.map(({ met, text }) => (
        <li key={text} className="flex items-center gap-2">
          {met ? (
            <Icon
              name="check_circle"
              filled
              className="w-4 h-4 shrink-0 text-primary"
            />
          ) : (
            <Icon name="cancel" className="w-4 h-4 shrink-0" />
          )}
          <span className={classNames(met && 'text-on-surface')}>{text}</span>
        </li>
      ))}
    </ul>
  );
}
