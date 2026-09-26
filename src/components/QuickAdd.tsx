import IconButton from './buttons/IconButton';
import Icon from './Icon';

type QuickAddProps = {
  onAdd: () => void;
};

export default function QuickAdd({ onAdd }: QuickAddProps) {
  return (
    <div className="fixed md:right-8 right-5 bottom-20 md:bottom-10">
      <IconButton color="blue" onClick={onAdd}>
        <Icon name="add" className="text-white h-7 w-7" />
      </IconButton>
    </div>
  );
}
