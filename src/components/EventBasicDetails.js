import Label from "./Label";
import OutlinedInput from "./inputs/OutlinedInput";
import TimeInput from "./inputs/TimeInput";

export default function EventBasicDetails({ event, onFieldChange }) {
	return (
		<>
			<div className="sm:hidden font-semibold mb-5">Details</div>
			<Label>Title</Label>
			<OutlinedInput
				value={event.title}
				onChange={(value) => onFieldChange("title", value)}
				placeholder="Title"
				className="mb-4"
			/>

			<Label>Description</Label>
			<OutlinedInput
				value={event.description}
				onChange={(value) => onFieldChange("description", value)}
				placeholder="Description"
				className="mb-4"
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="w-full">
					<Label>Date</Label>
					<OutlinedInput
						value={event.date}
						onChange={(value) => onFieldChange("date", value)}
						placeholder="Date"
						className="mb-2 h-10"
						type="date"
					/>
				</div>

				<div className="flex gap-4">
					<div className="w-full">
						<Label>Time</Label>
						<TimeInput onChange={(value) => onFieldChange("start_time", value)} />
					</div>
					<div className="w-full">
						<Label>End time</Label>
						<TimeInput className="w-full" onChange={(value) => onFieldChange("end_time", value)} />
					</div>
				</div>
			</div>
		</>
	);
}
