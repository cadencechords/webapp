import classNames from 'classnames';
import Toggle from './Toggle';
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

/** A permission as a two-line switch row: the whole row toggles it, when the
    current member can. */
export default function Permission({
  name,
  description,
  checkable,
  checked,
  onChange,
}: PermissionProps) {
  return (
    <Toggle
      enabled={checked}
      onChange={checkedValue => checkable && onChange(checkedValue)}
      disabled={!checkable}
      className={classNames(
        LIST_ITEM_TWO_LINE,
        checkable && LIST_ITEM_INTERACTIVE
      )}
      labelClassName={classNames(
        'flex-1 min-w-0',
        checkable && 'cursor-pointer'
      )}
      label={
        <>
          <div>{name}</div>
          <div className={LIST_SUPPORTING_TEXT}>{description}</div>
        </>
      }
    />
  );
}
