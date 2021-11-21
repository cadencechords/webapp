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

export default function AutoscrollSheet({ song, onSongChange, className }) {
	const iconClasses = "w-14 h-14 text-blue-600";
	const [isScrolling, setIsScrolling] = useState(false);
	const [intervalId, setIntervalId] = useState();
	const [showShortcut, setShowShortcut] = useState(false);
	const [updates, setUpdates] = useState();
	const currentMember = useSelector(selectCurrentMember);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		return () => clearInterval(intervalId);
	}, [intervalId]);

	function handleToggleScroll() {
		if (isScrolling) {
			handleStopScrolling();
		} else {
			setShowShortcut(true);
			setIsScrolling(true);
			let { px, interval } = SPEEDS[song?.scroll_speed || 1];
			let newIntervalId = setInterval(() => scroll(px), [interval]);

			setIntervalId(newIntervalId);
		}
	}

	function handleSpeedChange(newSpeed) {
		clearInterval(intervalId);
		setIntervalId(null);
		if (currentMember.can(EDIT_SONGS)) {
			setUpdates({ scroll_speed: newSpeed });
		}

		if (isScrolling) {
			let { px, interval } = SPEEDS[newSpeed];
			let newIntervalId = setInterval(() => scroll(px), [interval]);
			setIntervalId(newIntervalId);
		}
		onSongChange("scroll_speed", newSpeed);
	}

	function scroll(speed) {
		let page = document.querySelector("html");
		if (isAtBottom(page)) {
			clearInterval(intervalId);
			setIntervalId(null);
			setIsScrolling(false);
		} else {
			let currentScrollPosition = page.scrollTop;
			page.scroll({
				top: currentScrollPosition + speed,
				left: 0,
			});
		}
	}

	function isAtBottom(element) {
		return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= 13;
	}

	function handleStopScrolling() {
		clearInterval(intervalId);
		setIsScrolling(false);
		setIntervalId(null);
		setShowShortcut(false);
	}

	function handlePauseScrolling() {
		clearInterval(intervalId);
		setIsScrolling(false);
		setIntervalId(null);
	}

	function handleStartScrolling() {
		setIsScrolling(true);
		let { px, interval } = SPEEDS[song?.scroll_speed || 1];
		let newIntervalId = setInterval(() => scroll(px), [interval]);

		setIntervalId(newIntervalId);
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
		<div className={className}>
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
			<div className="flex-center mb-4">
				<button className="outline-none focus:outline-none" onClick={handleToggleScroll}>
					{isScrolling ? (
						<PauseIcon className={iconClasses} />
					) : (
						<PlayIcon className={iconClasses} />
					)}
				</button>
			</div>
			<div className="mb-2">
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
			{showShortcut && (
				<div className="fixed right-8 bottom-8 flex-center">
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
					<button className="ml-2 focus:outline-none outline-none" onClick={handleStopScrolling}>
						<XCircleIcon className="w-10 h-10 text-gray-500" />
					</button>
				</div>
			)}
		</div>
	);
}

AutoscrollSheet.defaultProps = {
	className: "",
};

const SPEEDS = {
	1: { px: 1, interval: 400 },
	2: { px: 1, interval: 350 },
	3: { px: 1, interval: 300 },
	4: { px: 2, interval: 350 },
	5: { px: 2, interval: 300 },
	6: { px: 3, interval: 350 },
	7: { px: 3, interval: 300 },
	8: { px: 3, interval: 200 },
	9: { px: 3, interval: 150 },
	10: { px: 3, interval: 100 },
};
