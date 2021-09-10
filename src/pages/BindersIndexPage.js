import { useEffect, useState } from "react";

import { ADD_BINDERS } from "../utils/constants";
import BinderApi from "../api/BinderApi";
import BindersList from "../components/BindersList";
import Button from "../components/Button";
import CreateBinderDialog from "../components/CreateBinderDialog";
import MobileHeader from "../components/MobileHeader";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import QuickAdd from "../components/QuickAdd";
import { selectCurrentMember } from "../store/authSlice";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

export default function BindersIndexPage() {
	useEffect(() => (document.title = "Binders"));
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [binders, setBinders] = useState([]);
	const [loading, setLoading] = useState(false);
	const router = useHistory();
	const currentMember = useSelector(selectCurrentMember);

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
	if (binders.length === 0) {
		content = <NoDataMessage type="binder" loading={loading} />;
	} else {
		content = (
			<div className="mb-10">
				<BindersList binders={binders} />
			</div>
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
					canAdd={currentMember.can(ADD_BINDERS)}
				/>
			</div>

			{content}

			{currentMember.can(ADD_BINDERS) && (
				<>
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
			)}
		</>
	);
}
