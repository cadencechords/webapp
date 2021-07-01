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
import Button from "./Button";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import BinderColor from "./BinderColor";

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
		content = (
			<>
				<div className="hidden sm:block">
					<BindersTable binders={binders} />
				</div>
				<div className="sm:hidden">
					{binders.map((binder) => (
						<div
							key={binder.id}
							className="border-b py-2.5 flex items-center px-2 last:border-0 cursor-pointer bg-white transition-colors hover:bg-gray-50 focus:bg-gray-50"
							onClick={() => router.push(`/app/binders/${binder.id}`)}
						>
							<BinderColor color={binder.color} />
							<div className="ml-3">
								<div className="font-semibold">{binder.name}</div>
								<div className="text-sm text-gray-600">{binder.description}</div>
							</div>
						</div>
					))}
				</div>
			</>
		);
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
			<Button
				variant="open"
				className="bg-white fixed bottom-12 left-0 rounded-none flex-center sm:hidden h-12"
				full
				style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
				onClick={() => setShowCreateDialog(true)}
			>
				<PlusCircleIcon className="h-4 w-4 mr-2 text-blue-700" />
				Add new binder
			</Button>
			<div className="hidden sm:block">
				<QuickAdd onAdd={() => setShowCreateDialog(true)} />
			</div>
		</>
	);
}
