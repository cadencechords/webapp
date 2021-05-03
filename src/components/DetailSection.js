import DetailTag from "./DetailTag";
import DetailTitle from "./DetailTitle";
import BinderColor from "./BinderColor";

export default function DetailSection({ title, items }) {
	return (
		<div className="mb-1">
			<div className="mb-2">
				<DetailTitle>{title}</DetailTitle>
			</div>
			<div className="flex flex-wrap">
				<span className="mr-2 mb-2">
					<DetailTag>
						<BinderColor color="green" size="3" />
						<span className="ml-1">Hymns</span>
					</DetailTag>
				</span>
			</div>
		</div>
	);
}
