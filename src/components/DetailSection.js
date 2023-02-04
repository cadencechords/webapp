import Button from './Button';
import DetailTag from './DetailTag';
import DetailTitle from './DetailTitle';
import NoDataMessage from './NoDataMessage';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import XIcon from '@heroicons/react/outline/XIcon';

export default function DetailSection({
  title,
  items,
  onAdd,
  onDelete,
  canEdit,
}) {
  return (
    <div className="mb-1">
      <div className="mb-2 flex-between">
        <DetailTitle>{title}</DetailTitle>
        {canEdit && onAdd && (
          <Button size="sm" variant="icon" onClick={onAdd} color="blue">
            <PlusIcon className="w-4 h-4" />
          </Button>
        )}
      </div>
      {items?.length > 0 ? (
        <div className="flex flex-wrap">
          {items?.map((item, index) => (
            <span className="mb-2 mr-2" key={index}>
              <DetailTag>
                <span className="mx-1">{item.name}</span>
                {canEdit && onDelete && (
                  <XIcon
                    className="w-3 h-3 text-gray-700 cursor-pointer dark:text-dark-gray-200"
                    onClick={() => onDelete(item.id)}
                  />
                )}
              </DetailTag>
            </span>
          ))}
        </div>
      ) : (
        <NoDataMessage type={title.toLowerCase()} />
      )}
    </div>
  );
}
