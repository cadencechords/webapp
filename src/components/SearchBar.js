import SearchDialog from './SearchDialog';
import { useState } from 'react';
import Icon from './Icon';

export default function SearchBar() {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="ml-5 flex items-center">
      <Icon
        name="search"
        className="h-4 w-4 text-gray-500 dark:text-dark-gray-200"
      />
      <span className="ml-4 w-60">
        <button
          className="outline-hidden focus:outline-hidden text-gray-500 dark:text-dark-gray-200 w-full text-left p-2"
          onClick={() => setIsSearching(true)}
        >
          Search library
        </button>
      </span>

      <SearchDialog
        open={isSearching}
        onCloseDialog={() => setIsSearching(false)}
      />
    </div>
  );
}
