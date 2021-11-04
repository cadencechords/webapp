import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "../components/buttons/IconButton";
import PageLoading from "../components/PageLoading";
import SetlistApi from "../api/SetlistApi";
import SetlistNavigation from "../components/SetlistNavigation";
import SongsCarousel from "../components/SongsCarousel";
import XIcon from "@heroicons/react/outline/XIcon";
import { noop } from "../utils/constants";
import { selectSetlistBeingPresented } from "../store/presenterSlice";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import { useState } from "react";

export default function SetPresenter() {
	const setlist = useSelector(selectSetlistBeingPresented);
	const [songBeingViewedIndex, setSongBeingViewedIndex] = useState(0);
	const { id } = useParams();
	const dispatch = useDispatch();

	if (setlist?.songs) {
		return (
			<>
				<div className="mx-auto max-w-4xl p-3 whitespace-pre-wrap mb-12">
					<SongsCarousel
						songs={setlist.songs}
						onIndexChange={setSongBeingViewedIndex}
						index={songBeingViewedIndex}
					/>
				</div>

				<SetlistNavigation
					songs={setlist.songs}
					onIndexChange={setSongBeingViewedIndex}
					index={songBeingViewedIndex}
				/>
				<Link to={`/sets/${id}`}>
					<IconButton className="fixed bottom-16 right-4" onClick={noop}>
						<XIcon className="h-6 w-6" />
					</IconButton>
				</Link>
			</>
		);
	} else {
		SetlistApi.getOne(id).then((response) => dispatch(setSetlistBeingPresented(response.data)));
		return <PageLoading />;
	}
}
