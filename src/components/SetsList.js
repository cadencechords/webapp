import NoDataMessage from "./NoDataMessage";
import PageTitle from "./PageTitle";

export default function SetsList() {
	return (
		<>
			<PageTitle title="Sets" />
			<NoDataMessage type="set" />
		</>
	);
}
