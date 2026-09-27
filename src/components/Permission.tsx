import classNames from 'classnames';
import Checkbox from './Checkbox';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from './lists/listItem';

type PermissionProps = {
  name: string;
  description: string;
  /** Whether the current member can toggle it; `onChange` fires only then. */
  checkable?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default function Permission({
  name,
  description,
  checkable,
  checked,
  onChange,
}: PermissionProps) {
  function handleChange(checkedValue: boolean) {
    if (checkable) {
      onChange(checkedValue);
    }
  }

  return (
    <div
      className={classNames(
        LIST_ITEM_TWO_LINE,
        checkable && LIST_ITEM_INTERACTIVE
      )}
    >
      <Checkbox checked={checked} onChange={handleChange} />
      <div
        onClick={() => handleChange(!checked)}
        className={`${checkable && 'cursor-pointer'} w-full`}
      >
        <div>{name}</div>
        <div className={LIST_SUPPORTING_TEXT}>{description}</div>
      </div>
    </div>
  );
}
