import Button from './Button';
import Icon from './Icon';

export default function TableRow({
  columns,
  editable,
  onClick,
  removable,
  onRemove,
  removing,
  actions,
}) {
  return (
    <tr className="border-b dark:border-dark-gray-700">
      {columns?.map((column, index) => (
        <td key={index} className="px-2 py-2 mx-3">
          {index === 0 ? <span onClick={onClick}>{column}</span> : column}
        </td>
      ))}

      {editable && (
        <td className="px-2 py-2 mx-3">
          <Icon name="edit" filled className="w-4 h-4 text-purple-700" />
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
            <Icon
              name="delete"
              className="w-4 h-4 text-gray-600 dark:text-dark-gray-200"
            />
          </Button>
        </td>
      )}
      {actions && <td>{actions}</td>}
    </tr>
  );
}

TableRow.defaultProps = {
  removable: false,
};
