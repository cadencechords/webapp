import Button from "./Button";
import MobileHeader from "./MobileHeader";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";

export default function MobileHeaderAndBottomButton({ pageTitle, onAdd, buttonText, canAdd }) {
	return (
		<>
			<MobileHeader title={pageTitle} onAdd={onAdd} canAdd={canAdd} />
			{canAdd && (
				<Button
					variant="open"
					className="bg-white fixed bottom-12 left-0 rounded-none flex-center sm:hidden h-12"
					full
					style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
					onClick={onAdd}
				>
					<PlusCircleIcon className="h-4 w-4 mr-2 text-blue-700" />
					{buttonText}
				</Button>
			)}
		</>
	);
}
