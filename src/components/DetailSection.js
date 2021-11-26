import Button from "./Button";
import DetailTag from "./DetailTag";
import DetailTitle from "./DetailTitle";
import NoDataMessage from "./NoDataMessage";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import XIcon from "@heroicons/react/outline/XIcon";

export default function DetailSection({ title, items, onAdd, onDelete, canEdit }) {
	return (
		<div className="mb-1">
			<div className="mb-2 flex-between">
				<DetailTitle>{title}</DetailTitle>
				{canEdit && onAdd && (
					<Button size="xs" variant="open" onClick={onAdd} color="gray">
						<PlusIcon className="h-4 w-4" />
					</Button>
				)}
			</div>
			{items?.length > 0 ? (
				<div className="flex flex-wrap">
					{items?.map((item, index) => (
						<span className="mr-2 mb-2" key={index}>
							<DetailTag>
								<span className="mx-1">{item.name}</span>
								{canEdit && onDelete && (
									<XIcon
										className="h-3 w-3 text-gray-700 dark:text-dark-gray-200 cursor-pointer"
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
