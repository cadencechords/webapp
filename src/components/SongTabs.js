import SongFilesTab from "./SongFilesTab";
import { Tab } from "@headlessui/react";
import { VIEW_FILES } from "../utils/constants";
import { selectCurrentMember } from "../store/authSlice";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function SongTabs() {
	const [files, setFiles] = useState();
	const currentSubscription = useSelector(selectCurrentSubscription);
	const currentMember = useSelector(selectCurrentMember);

	return (
		<Tab.Group
			as="div"
			className="border-t dark:border-dark-gray-700 lg:border-none pt-4 col-span-4 lg:col-span-3 "
		>
			<Tab.List>
				{currentSubscription.isPro && currentMember.can(VIEW_FILES) && (
					<Tab className="outline-none focus:outline-none">
						{({ selected }) => (
							<div className={`${selected ? SELECTED_TAB_CLASSES : ""} ${TAB_CLASSES}`}>Files</div>
						)}
					</Tab>
				)}
			</Tab.List>
			<Tab.Panels as="div" className="mt-4 outline-none focus:outline-none">
				{currentSubscription.isPro && currentMember.can(VIEW_FILES) && (
					<Tab.Panel as="div" className="outline-none focus:outline-none">
						<SongFilesTab onFilesChange={setFiles} files={files} />
					</Tab.Panel>
				)}
			</Tab.Panels>
		</Tab.Group>
	);
}

const TAB_CLASSES =
	"px-3 py-2 font-medium hover:bg-gray-100 dark:hover:bg-dark-gray-800 transition-colors";
const SELECTED_TAB_CLASSES = "border-b-4 border-blue-600 dark:border-dark-blue";
