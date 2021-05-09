import CreateBinderDialog from "./CreateBinderDialog";
import NoDataMessage from "./NoDataMessage";
import QuickAdd from "./QuickAdd";
import { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import BindersTable from "./BindersTable";
import PulseLoader from "react-spinners/PulseLoader";
import BinderApi from "../api/BinderApi";

export default function BindersList() {
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [binders, setBinders] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchBinders() {
			setLoading(true);
			try {
				let result = await BinderApi.getAll();
				setBinders(result.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchBinders();
	}, []);

	let content = null;

	if (loading) {
		content = (
			<div className="text-center py-4">
				<PulseLoader color="blue" />
			</div>
		);
	} else if (!loading && binders.length === 0) {
		content = <NoDataMessage type="binder" />;
	} else if (!loading && binders.length > 0) {
		content = <BindersTable binders={binders} />;
	}

	const handleBinderCreated = (newBinder) => {
		setBinders([...binders, newBinder]);
	};

	return (
		<>
			<PageTitle title="Binders" />
			{content}
			<CreateBinderDialog
				open={showCreateDialog}
				onCloseDialog={() => setShowCreateDialog(false)}
				onCreated={handleBinderCreated}
			/>
			<QuickAdd onAdd={() => setShowCreateDialog(true)} />
		</>
	);
}
