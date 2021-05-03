import StackedListItem from "./StackedListItem";

export default function StackedList({ items }) {
	return (
		<div>
			{items?.map((item, index) => (
				<StackedListItem key={item.id ? item.id : index}>
					{item}
				</StackedListItem>
			))}
		</div>
	);
}
