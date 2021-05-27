import DetailTag from "./DetailTag";
import DetailTitle from "./DetailTitle";
import OpenButton from "./buttons/OpenButton";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import NoDataMessage from "./NoDataMessage";

export default function DetailSection({ title, items, onAdd, onDelete }) {
	return (
		<div className="mb-1">
			<div className="mb-2 flex justify-between items-center">
				<DetailTitle>{title}</DetailTitle>
				{onAdd && (
					<OpenButton onClick={onAdd}>
						<PlusIcon className="h-4 w-4 text-gray-700 " />
					</OpenButton>
				)}
			</div>
			{items?.length > 0 ? (
				<div className="flex flex-wrap">
					{items?.map((item, index) => (
						<span className="mr-2 mb-2" key={index}>
							<DetailTag>
								<span className="mx-1">{item.name}</span>
								{onDelete && (
									<XIcon
										className="h-3 w-3 text-gray-700 cursor-pointer"
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
