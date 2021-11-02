import StackedListItem from "./StackedListItem";

export default function StackedList({ items, className }) {
	return (
		<div className={className}>
			{items?.map((item, index) => (
				<StackedListItem key={item.id ? item.id : index}>{item}</StackedListItem>
			))}
		</div>
	);
}

StackedList.defaultProps = {
	className: "",
};
