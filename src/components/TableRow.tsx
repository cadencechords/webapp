import type { MouseEventHandler, ReactNode } from 'react';
import Button from './Button';
import Icon from './Icon';

type TableRowProps = {
  columns?: ReactNode[];
  editable?: boolean;
  /** Called when the first column is clicked. */
  onClick?: MouseEventHandler<HTMLSpanElement>;
  removable?: boolean;
  onRemove?: () => void;
  removing?: boolean;
  actions?: ReactNode;
};

export default function TableRow({
  columns,
  editable,
  onClick,
  removable = false,
  onRemove,
  removing,
  actions,
}: TableRowProps) {
  return (
    <tr className="border-b border-outline-variant font-plain text-body-medium text-on-surface state-layer-flat">
      {columns?.map((column, index) => (
        <td key={index} className="px-2 py-3">
          {index === 0 ? <span onClick={onClick}>{column}</span> : column}
        </td>
      ))}

      {editable && (
        <td className="px-2 py-3">
          <Icon name="edit" filled className="w-4 h-4 text-primary" />
        </td>
      )}

      {removable && (
        <td className="pr-4 text-right">
          <Button
            onClick={onRemove}
            loading={removing}
            variant="open"
            size="xs"
            disabled={removing}
          >
            <Icon name="delete" className="w-4 h-4 text-on-surface-variant" />
          </Button>
        </td>
      )}
      {actions && <td>{actions}</td>}
    </tr>
  );
}
