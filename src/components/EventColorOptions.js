import EventColorOption from "./EventColorOption";
import Label from "./Label";

export default function EventColorOptions({ selectedColor, onClick }) {
	return (
		<div className="mb-6">
			<Label className="flex items-center gap-2 mb-4">
				Color {selectedColor && <EventColorOption color={selectedColor} disabled />}
			</Label>
			<div className="flex-between">
				<EventColorOption color="red" onClick={onClick} />
				<EventColorOption color="blue" onClick={onClick} />
				<EventColorOption color="yellow" onClick={onClick} />
				<EventColorOption color="green" onClick={onClick} />
				<EventColorOption color="pink" onClick={onClick} />
				<EventColorOption color="purple" onClick={onClick} />
				<EventColorOption color="indigo" onClick={onClick} />
				<EventColorOption color="gray" onClick={onClick} />
				<EventColorOption color="black" onClick={onClick} />
			</div>
		</div>
	);
}
