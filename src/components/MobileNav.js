import AppMenu from "./mobile menus/AppMenu";
import MenuIcon from "@heroicons/react/solid/MenuIcon";
import MobileNavLink from "./MobileNavLink";
import SearchIcon from "@heroicons/react/solid/SearchIcon";
import UserIcon from "@heroicons/react/solid/UserIcon";
import { useState } from "react";

export default function MobileNavbar() {
	const [showMenuDialog, setShowMenuDialog] = useState(false);

	const iconClasses = "h-6 w-6";
	return (
		<>
			<div className="fixed bottom-0 bg-white dark:bg-dark-gray-800 w-full dark:border-dark-gray-400 border-t md:hidden py-1 flex z-40">
				<MobileNavLink icon={<SearchIcon className={iconClasses} />} to="/search" />
				<MobileNavLink
					icon={<MenuIcon className={iconClasses} />}
					onClick={() => setShowMenuDialog(true)}
				/>
				<MobileNavLink icon={<UserIcon className={iconClasses} />} to="/account" />
			</div>
			<AppMenu open={showMenuDialog} onCloseDialog={() => setShowMenuDialog(false)} />
		</>
	);
}
