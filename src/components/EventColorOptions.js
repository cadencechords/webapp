import EventColorOption from './EventColorOption';
import Label from './Label';

export default function EventColorOptions({ selectedColor, onClick }) {
  return (
    <div className="mb-8">
      <Label className="flex items-center gap-2 mb-4">
        Color{' '}
        {selectedColor && <EventColorOption color={selectedColor} disabled />}
      </Label>
      <div className="flex items-center">
        <EventColorOption color="red" onClick={onClick} className="mr-4" />
        <EventColorOption color="blue" onClick={onClick} className="mr-4" />
        <EventColorOption color="yellow" onClick={onClick} className="mr-4" />
        <EventColorOption color="green" onClick={onClick} className="mr-4" />
        <EventColorOption color="pink" onClick={onClick} className="mr-4" />
        <EventColorOption color="purple" onClick={onClick} className="mr-4" />
        <EventColorOption color="indigo" onClick={onClick} className="mr-4" />
        <EventColorOption color="gray" onClick={onClick} className="mr-4" />
        <EventColorOption color="black" onClick={onClick} />
      </div>
    </div>
  );
}
