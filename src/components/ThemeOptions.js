import ThemeOption from "./ThemeOption";

export default function ThemeOptions({ themes, onToggle, selectedThemes }) {
	return (
		<div className="grid grid-flow-row grid-cols-2 gap-x-5 gap-y-2 my-4 sm:max-h-64 overflow-y-auto mb-10 max-h-full sm:mb-4">
			{themes.map((theme) => (
				<div key={theme.id}>
					<ThemeOption
						theme={theme}
						onToggle={onToggle}
						selected={selectedThemes?.includes(theme)}
					/>
				</div>
			))}
		</div>
	);
}
