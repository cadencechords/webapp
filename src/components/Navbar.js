import AccountOptionsPopover from "./AccountOptionsPopover";
import FeedbackPopover from "./FeedbackPopover";
import SearchBar from "./SearchBar";
import SupportIcon from "@heroicons/react/outline/SupportIcon";

export default function Navbar() {
  function handleOpenBeacon() {
    window.Beacon("open");
  }
  return (
    <nav className="hidden md:flex md:ml-14 lg:ml-52 px-4 border-b dark:border-dark-gray-400 h-16  items-center justify-between">
      <SearchBar />
      <span className="flex-center">
        <button className="mr-8" onClick={handleOpenBeacon}>
          <SupportIcon className="w-7 h-7 text-gray-600 dark:text-dark-gray-200" />
        </button>
        <FeedbackPopover />
        <AccountOptionsPopover />
      </span>
    </nav>
  );
}
