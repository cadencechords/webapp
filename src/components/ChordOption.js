import Checkbox from './Checkbox';

export default function ChordOption({ optionName, children, on, onChange }) {
  return (
    <div className="text-sm flex-between">
      {optionName}
      {children ? (
        children
      ) : (
        <Checkbox checked={!!on} onChange={() => onChange(!on)} />
      )}
    </div>
  );
}
