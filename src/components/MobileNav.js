import MobileNavLink from "./MobileNavLink";
import UserIcon from "@heroicons/react/solid/UserIcon";
import MenuIcon from "@heroicons/react/solid/MenuIcon";
import SearchIcon from "@heroicons/react/solid/SearchIcon";
import { useState } from "react";

export default function MobileNavbar() {
	const [showMenuDialog, setShowMenuDialog] = useState(false);

	const iconClasses = "h-6 w-6";
	return (
		<div className="fixed bottom-0 bg-white w-full border-t md:hidden py-1 flex">
			<MobileNavLink icon={<SearchIcon className={iconClasses} />} />
			<MobileNavLink icon={<MenuIcon className={iconClasses} />} />
			<MobileNavLink icon={<UserIcon className={iconClasses} />} to="/app/account" />
		</div>
	);
}
