import Button from "./Button";
import EventColorOptions from "./EventColorOptions";
import EventReminders from "./EventReminders";
import { useState } from "react";
import Icon from './Icon';

export default function EventAdvancedOptions({ event, onFieldChange, onMembersLoaded, members }) {
	const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

	function handleToggle() {
		setShowAdvancedOptions((currentlyShowing) => !currentlyShowing);
	}
	return (
		<div>
			<div className="flex justify-end my-2">
				<Button variant="open" className="flex-center gap-2" onClick={handleToggle}>
					Advanced options
					<Icon name="keyboard_arrow_down"
						className={`w-4 h-4 transition-transform transform ${
							showAdvancedOptions && "-rotate-180"
						}`}
					/>
				</Button>
			</div>

			<div className={!showAdvancedOptions ? "hidden" : ""}>
				<EventColorOptions
					onClick={(value) => onFieldChange("color", value)}
					selectedColor={event.color}
				/>

				<EventReminders
					event={event}
					onFieldChange={onFieldChange}
					members={members}
					onMembersLoaded={onMembersLoaded}
				/>
			</div>
		</div>
	);
}
