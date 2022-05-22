import AccountOptionsPopover from "./AccountOptionsPopover";
import Button from "./Button";
import FeedbackPopover from "./FeedbackPopover";
import SearchBar from "./SearchBar";
import SupportButton from "./SupportButton";

export default function Navbar() {
  return (
    <nav className="hidden md:flex md:ml-14 lg:ml-52 px-4 border-b dark:border-dark-gray-400 h-16  items-center justify-between">
      <SearchBar />
      <span className="flex-center">
        <SupportButton />
        <FeedbackPopover />
        <AccountOptionsPopover />
        <a href="https://www.app.cadencechords.com/signup" className="ml-4">
          <Button color="purple">Sign up</Button>
        </a>
      </span>
    </nav>
  );
}
