import MobileNavLink from "./MobileNavLink";
import UserIcon from "@heroicons/react/solid/UserIcon";
export default function MobileNavbar() {
	const iconClasses = "h-6 w-6";
	return (
		<div className="fixed bottom-0 bg-white w-full border-t md:hidden py-2">
			<MobileNavLink icon={<UserIcon className={iconClasses} />} text="Account" to="/app/account" />
		</div>
	);
}
