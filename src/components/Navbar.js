import AccountOptionsPopover from './AccountOptionsPopover';
import FeedbackPopover from './FeedbackPopover';
import SearchBar from './SearchBar';
// import SupportButton from "./SupportButton";

export default function Navbar() {
  return (
    <nav className="items-center justify-between hidden h-16 px-4 border-b md:flex md:ml-14 lg:ml-52 dark:border-dark-gray-400">
      <SearchBar />
      <span className="flex-center">
        {/* <SupportButton /> */}
        <FeedbackPopover />
        <AccountOptionsPopover />
      </span>
    </nav>
  );
}
