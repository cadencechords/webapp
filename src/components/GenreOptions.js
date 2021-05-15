import GenreOption from "./GenreOption";

export default function GenreOptions({ genres, selectedGenres, onToggle }) {
	return (
		<div
			className={
				"grid grid-flow-row grid-cols-2 gap-x-5 gap-y-2 my-4 max-h-80 sm:max-h-64 overflow-y-auto mb-10 sm:mb-4"
			}
		>
			{genres.map((genre) => (
				<div key={genre.id}>
					<GenreOption
						genre={genre}
						onToggle={onToggle}
						selected={selectedGenres?.includes(genre)}
					/>
				</div>
			))}
		</div>
	);
}
