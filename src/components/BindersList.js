import CreateBinderDialog from "./CreateBinderDialog";
import NoDataMessage from "./NoDataMessage";
import QuickAdd from "./QuickAdd";
import { useState } from "react";
import PageTitle from "./PageTitle";
import BindersTable from "./BindersTable";

export default function BindersList() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	return (
		<>
			<PageTitle title="Binders" />
			{/* <NoDataMessage type="binder" /> */}
			<BindersTable />
			<CreateBinderDialog
				open={isCreateDialogOpen}
				onCloseDialog={() => setIsCreateDialogOpen(false)}
			/>
			<QuickAdd onAdd={() => setIsCreateDialogOpen(true)} />
		</>
	);
}
