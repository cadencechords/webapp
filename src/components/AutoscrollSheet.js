import { useEffect, useState } from "react";

import Button from "./Button";
import { EDIT_SONGS } from "../utils/constants";
import PauseIcon from "@heroicons/react/solid/PauseIcon";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import Range from "./Range";
import SectionTitle from "./SectionTitle";
import SongApi from "../api/SongApi";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function AutoscrollSheet({
	song,
	onSongChange,
	className,
	bottomSheetOpen,
	shortcutClasses,
}) {
	const iconClasses = "w-14 h-14 text-blue-600";
	const [isScrolling, setIsScrolling] = useState(false);
	const [showShortcut, setShowShortcut] = useState(false);
	const [updates, setUpdates] = useState();
	const currentMember = useSelector(selectCurrentMember);
	const [loading, setLoading] = useState(false);
	const [animationFrameId, setAnimationFrameId] = useState();

	useEffect(() => {
		setIsScrolling(false);
		setUpdates(null);
		cancelAnimationFrame(animationFrameId);
		setAnimationFrameId(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [song.id]);

	useEffect(() => {
		return () => cancelAnimationFrame(animationFrameId);
	}, [animationFrameId]);

	function handleToggleScroll() {
		if (isScrolling) {
			handleStopScrolling();
		} else {
			setShowShortcut(true);
			setIsScrolling(true);
			let { px, interval } = SPEEDS[song.scroll_speed || 1];
			setAnimationFrameId(requestAnimationFrame(() => scroll(0, px, interval)));
		}
	}

	function handleSpeedChange(newSpeed) {
		cancelAnimationFrame(animationFrameId);
		setAnimationFrameId(null);

		if (currentMember.can(EDIT_SONGS)) {
			setUpdates({ scroll_speed: newSpeed });
		}

		if (isScrolling) {
			let { px, interval } = SPEEDS[newSpeed || 1];
			setAnimationFrameId(requestAnimationFrame(() => scroll(0, px, interval)));
		}
		onSongChange("scroll_speed", newSpeed);
	}

	function isAtBottom(element) {
		return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= 13;
	}

	function handleStopScrolling() {
		cancelAnimationFrame(animationFrameId);
		setAnimationFrameId(null);
		setIsScrolling(false);
		setShowShortcut(false);
	}

	function handlePauseScrolling() {
		cancelAnimationFrame(animationFrameId);
		setIsScrolling(false);
		setAnimationFrameId(null);
	}

	function handleStartScrolling() {
		setIsScrolling(true);
		let { px, interval } = SPEEDS[song?.scroll_speed || 1];
		setAnimationFrameId(() => scroll(0, px, interval));
	}

	function scroll(time, px, interval) {
		let page = document.querySelector("html");
		let currentScrollPosition = page.scrollTop;
		if (isAtBottom(page)) {
			cancelAnimationFrame(animationFrameId);
			setAnimationFrameId(null);
			setIsScrolling(false);
		} else {
			if (time % interval === 0) {
				page.scroll({
					top: currentScrollPosition + px,
					left: page.scrollLeft,
					behavior: "smooth",
				});
			}
			setAnimationFrameId(requestAnimationFrame(() => scroll(time + 1, px, interval)));
		}
	}

	async function handleSaveChanges() {
		try {
			setLoading(true);
			await SongApi.updateOneById(song.id, updates);
		} catch (error) {
			reportError(error);
		} finally {
			setLoading(false);
			setUpdates(null);
		}
	}

	return (
		<>
			<div className={` ${className}`}>
				<SectionTitle
					title={
						<>
							Auto scroll
							{updates && currentMember.can(EDIT_SONGS) && (
								<Button
									variant="open"
									size="xs"
									onClick={handleSaveChanges}
									className="ml-4"
									loading={loading}
								>
									Save changes
								</Button>
							)}
						</>
					}
				/>
				{/* <button onClick={start}>start</button> <button onClick={stop}>stop</button> */}
				<div className="flex-center mb-4">
					<button className="outline-none focus:outline-none" onClick={handleToggleScroll}>
						{isScrolling ? (
							<PauseIcon className={iconClasses} />
						) : (
							<PlayIcon className={iconClasses} />
						)}
					</button>
				</div>
				<div className="pb-2">
					Current speed is
					<span className="font-semibold text-lg ml-2">{song.scroll_speed || 1}</span>
				</div>
				<Range
					value={song.scroll_speed || 1}
					max={10}
					min={1}
					step={1}
					onChange={handleSpeedChange}
				/>
			</div>
			{showShortcut && !bottomSheetOpen && (
				<div className={`fixed flex-center flex-col z-10 ${shortcutClasses}`}>
					<button
						onClick={() => (isScrolling ? handlePauseScrolling() : handleStartScrolling())}
						className="focus:outline-none outline-none"
					>
						{isScrolling ? (
							<PauseIcon className={iconClasses} />
						) : (
							<PlayIcon className={iconClasses} />
						)}
					</button>
					<button className="focus:outline-none outline-none" onClick={handleStopScrolling}>
						<XCircleIcon className="w-10 h-10 text-gray-500" />
					</button>
				</div>
			)}
		</>
	);
}

AutoscrollSheet.defaultProps = {
	className: "",
	shortcutClasses: "",
};

const SPEEDS = {
	1: { px: 1, interval: 15 },
	2: { px: 1, interval: 13 },
	3: { px: 1, interval: 11 },
	4: { px: 1, interval: 9 },
	5: { px: 1, interval: 7 },
	6: { px: 1, interval: 5 },
	7: { px: 1, interval: 4 },
	8: { px: 1, interval: 3 },
	9: { px: 2, interval: 4 },
	10: { px: 3, interval: 3 },
};
