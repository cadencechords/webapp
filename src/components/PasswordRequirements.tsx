import Alert from './Alert';
import Icon from './Icon';

type PasswordRequirementsProps = {
  isLongEnough?: boolean;
  isUncommon?: boolean;
};

export default function PasswordRequirements({
  isLongEnough = false,
  isUncommon = false,
}: PasswordRequirementsProps) {
  const checkIcon = (
    <Icon
      name="check_circle"
      className="w-4 h-4 mx-3 text-green-600 dark:text-dark-green"
    />
  );
  const xIcon = (
    <Icon
      name="cancel"
      className="w-4 h-4 mx-3 text-red-600 dark:text-dark-red"
    />
  );
  return (
    <div className="mb-4">
      <Alert color="gray">
        <div className="flex flex-col text-sm">
          <div className="font-semibold">Your password should:</div>
          <ul>
            <li className="flex items-center mt-1">
              {isLongEnough ? checkIcon : xIcon}
              Be at least 8 characters long
            </li>
            <li className="flex items-center mt-1">
              {isUncommon ? checkIcon : xIcon}
              Not be a common password
            </li>
          </ul>
        </div>
      </Alert>
    </div>
  );
}
