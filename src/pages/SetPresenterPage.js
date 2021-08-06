import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSetlistBeingPresented } from "../store/presenterSlice";
import SetlistNavigation from "../components/SetlistNavigation";
import { toHtml, transpose } from "../utils/SongUtils";
import IconButton from "../components/buttons/IconButton";
import XIcon from "@heroicons/react/outline/XIcon";
import { useHistory, useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import SetlistApi from "../api/SetlistApi";
import { useDispatch } from "react-redux";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import PageLoading from "../components/PageLoading";
import Button from "../components/Button";
import ArrowsExpandIcon from "@heroicons/react/outline/ArrowsExpandIcon";
import { Textfit } from "react-textfit";

export default function SetPresenter() {
	const setlist = useSelector(selectSetlistBeingPresented);
	const [songBeingViewed, setSongBeingViewed] = useState(setlist?.songs?.[0]);
	const [autosizing, setAutosizing] = useState(false);
	const router = useHistory();
	const { id } = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		if (setlist?.songs) {
			setSongBeingViewed(setlist.songs[0]);
		}
	}, [setlist]);

	const handleSongIndexChange = (newSongIndex) => {
		setSongBeingViewed(setlist.songs[newSongIndex]);
	};

	const handleRouteToSetDetail = () => {
		router.push(`/sets/${id}`);
	};

	const handleToggleAutosize = () => {
		setAutosizing((autosizing) => !autosizing);
	};

	if (setlist?.songs) {
		let formatStyles = {
			fontFamily: songBeingViewed.format?.font,
			fontSize: songBeingViewed.format?.font_size,
		};
		return (
			<>
				<div className="mx-auto max-w-2xl p-3 whitespace-pre-wrap mb-12">
					<PageTitle title={songBeingViewed.name} />
					<div style={formatStyles}>
						{autosizing ? (
							<Textfit mode="single" onReady={(e) => console.log(e)}>
								{toHtml(
									transpose(songBeingViewed),
									{
										boldChords: songBeingViewed.format?.bold_chords,
										italicChords: songBeingViewed.format?.italic_chords,
										showChordsDisabled: songBeingViewed.showChordsDisabled,
									},
									false
								)}
							</Textfit>
						) : (
							toHtml(transpose(songBeingViewed), {
								boldChords: songBeingViewed.format?.bold_chords,
								italicChords: songBeingViewed.format?.italic_chords,
								showChordsDisabled: songBeingViewed.showChordsDisabled,
							})
						)}
					</div>
				</div>
				<Button
					variant="open"
					color="gray"
					className="fixed right-7 bottom-28"
					onClick={handleToggleAutosize}
				>
					<ArrowsExpandIcon className="w-6 h-6" />
				</Button>
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
