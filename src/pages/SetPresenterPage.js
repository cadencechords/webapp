import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSetlistBeingPresented } from "../store/presenterSlice";
import SetlistNavigation from "../components/SetlistNavigation";
import { toHtml } from "../utils/SongUtils";
import IconButton from "../components/buttons/IconButton";
import XIcon from "@heroicons/react/outline/XIcon";
import { useHistory, useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import SetlistApi from "../api/SetlistApi";
import { useDispatch } from "react-redux";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import PageLoading from "../components/PageLoading";

export default function SetPresenter() {
	const setlist = useSelector(selectSetlistBeingPresented);
	const [songBeingViewed, setSongBeingViewed] = useState(setlist?.songs?.[0]);
	const router = useHistory();
	const { id } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (setlist?.songs) {
			setSongBeingViewed(setlist.songs[0]);
		}
	}, [setlist]);

	const handleSongIndexChange = (newSongIndex) => {
		console.log(setlist.songs[newSongIndex]);
		setSongBeingViewed(setlist.songs[newSongIndex]);
	};

	const handleRouteToSetDetail = () => {
		router.push(`/sets/${id}`);
	};

	if (setlist?.songs) {
		let formatStyles = { fontFamily: songBeingViewed.font, fontSize: songBeingViewed.font_size };
		return (
			<>
				<div className="mx-auto max-w-2xl p-3 whitespace-pre-wrap">
					<PageTitle title={songBeingViewed.name} />
					<div style={formatStyles}>
						{toHtml(songBeingViewed.content, {
							boldChords: songBeingViewed.bold_chords,
							italicChords: songBeingViewed.italic_chords,
							showChordsDisabled: songBeingViewed.showChordsDisabled,
						})}
					</div>
				</div>
				<IconButton className="fixed bottom-16 right-8" onClick={handleRouteToSetDetail}>
					<XIcon className="h-6 w-6" />
				</IconButton>
				<SetlistNavigation songs={setlist.songs} onSongIndexChange={handleSongIndexChange} />
			</>
		);
	} else {
		SetlistApi.getOne(id).then((response) => dispatch(setSetlistBeingPresented(response.data)));
		return <PageLoading />;
	}
}
