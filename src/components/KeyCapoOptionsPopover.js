import Button from "./Button";
import MobileMenuButton from "./buttons/MobileMenuButton";
import StyledPopover from "./StyledPopover";

export default function KeyCapoOptionsPopover({ song, onShowBottomSheet }) {
	if (!song) return null;

	const button = (
		<Button size="square" className="mr-2 h-9 w-9">
			{song.capo?.capo_key || (song.show_transposed && song.transposed_key) || song.original_key}
		</Button>
	);

	return (
		<StyledPopover button={button} position="bottom-end" className="w-48">
			<MobileMenuButton
				size="sm"
				full
				className="rounded-t-md border-b"
				onClick={() => onShowBottomSheet("transpose")}
			>
				Transpose
			</MobileMenuButton>
			<MobileMenuButton
				size="sm"
				full
				className="rounded-b-md"
				onClick={() => onShowBottomSheet("capo")}
			>
				Capo
			</MobileMenuButton>
		</StyledPopover>
	);
}
