import SidenavLink from "./SidenavLink";

export default function Sidenav() {
	return (
		<div className="fixed h-full flex flex-col bg-gray-800 w-56">
			<div className="font-display flex items-center justify-center font-extrabold text-white text-2xl tracking-wider h-16 bg-gray-900">
				Cadence
			</div>

			<div className="px-2 flex flex-col py-3 ">
				<SidenavLink text="Binders" />
				<SidenavLink text="Songs" active />
				<SidenavLink text="Sets" />
			</div>
		</div>
	);
}
