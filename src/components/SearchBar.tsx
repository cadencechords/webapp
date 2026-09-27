import SearchDialog from './SearchDialog';
import { useState } from 'react';
import Icon from './Icon';

export default function SearchBar() {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="ml-5 flex items-center">
      {/* M3 search bar: opens the search dialog. It sits on the header's
          surface-container, so it takes the lowest container (the page
          sheet's white, or near-black in dark) to stand out from it. */}
      <button
        className="flex items-center gap-4 w-72 h-12 px-4 rounded-full bg-surface-container-lowest text-on-surface-variant font-plain text-body-large text-left state-layer-flat focus-ring"
        onClick={() => setIsSearching(true)}
      >
        <Icon name="search" className="h-6 w-6 shrink-0 text-on-surface" />
        Search library
      </button>

      <SearchDialog
        open={isSearching}
        onCloseDialog={() => setIsSearching(false)}
      />
    </div>
  );
}
