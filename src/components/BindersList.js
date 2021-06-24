import CreateBinderDialog from "./CreateBinderDialog";
import NoDataMessage from "./NoDataMessage";
import QuickAdd from "./QuickAdd";
import { useEffect, useState } from "react";
import PageTitle from "./PageTitle";
import BindersTable from "./BindersTable";
import PulseLoader from "react-spinners/PulseLoader";
import BinderApi from "../api/BinderApi";
import { useHistory } from "react-router";
import MobileHeader from "./MobileHeader";

export default function BindersList() {
	useEffect(() => (document.title = "Binders"));
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [binders, setBinders] = useState([]);
	const [loading, setLoading] = useState(false);
	const router = useHistory();

	useEffect(() => {
		async function fetchBinders() {
			setLoading(true);
			try {
				let result = await BinderApi.getAll();
				setBinders(result.data);
			} catch (error) {
				if (error.response.status === 401) {
					router.push("/login");
				}
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchBinders();
	}, [router]);

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
			<div className="hidden sm:block">
				<PageTitle title="Binders" />
			</div>
			<div className="h-14 mb-4 sm:hidden">
				<MobileHeader
					title="Binders"
					className="shadow-inner"
					onAdd={() => setShowCreateDialog(true)}
				/>
			</div>
			{content}
			<CreateBinderDialog
				open={showCreateDialog}
				onCloseDialog={() => setShowCreateDialog(false)}
				onCreated={handleBinderCreated}
			/>
			<div className="hidden sm:block">
				<QuickAdd onAdd={() => setShowCreateDialog(true)} />
			</div>
		</>
	);
}
