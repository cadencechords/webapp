import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import BinderApi from "../api/BinderApi";
import Button from "./Button";
import Checkbox from "./Checkbox";
import PageLoading from "./PageLoading";
import { useEffect } from "react";
import { useState } from "react";

export default function OnsongChooseBinderForSongs({
	binders,
	onBindersLoaded,
	onSelectBinder,
	selectedBinder,
	onBackClick,
	onNextClick,
}) {
	const [loadingBinders, setLoadingBinders] = useState(false);
	useEffect(() => {
		async function fetchBinders() {
			try {
				setLoadingBinders(true);
				let { data } = await BinderApi.getAll();
				onBindersLoaded(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingBinders(false);
			}
		}

		if (!binders) {
			fetchBinders();
		}
	}, [binders, onBindersLoaded]);

	let content = null;

	if (loadingBinders) {
		content = <PageLoading>Hang on while we pull up your binders</PageLoading>;
	} else if (!loadingBinders && binders?.length === 0) {
		content = "Looks like you don't have any binders created yet. You can just hit continue.";
	} else {
		content = (
			<div className="flex flex-col gap-3 my-4">
				{binders?.map((binder) => (
					<div
						key={binder.id}
						className={`rounded-md cursor-pointer flex items-center w-full text-left focus:outline-none outline-none py-2 px-3 ${
							selectedBinder === binder ? "ring-inset ring-2 ring-blue-400" : ""
						}`}
						onClick={() => onSelectBinder(binder)}
					>
						<Checkbox onChange={() => {}} checked={selectedBinder === binder} />
						<span className="ml-4 flex items-center">{binder.name}</span>
					</div>
				))}
			</div>
		);
	}

	return (
		<>
			<p className="text-lg">
				Choose a binder you'd like to add these songs to, or continue to the next page to import the
				songs without adding them to a binder.
			</p>
			{content}
			<div className="flex-between">
				<Button variant="open" color="gray" bold onClick={onBackClick}>
					<div className="flex-center">
						<ArrowNarrowLeftIcon className="w-5 h-5 mr-2" /> Back
					</div>
				</Button>
				<Button onClick={onNextClick}>
					<div className="flex-center">
						Review
						<ArrowNarrowRightIcon className="w-5 h-5 ml-2" />
					</div>
				</Button>
			</div>
		</>
	);
}
