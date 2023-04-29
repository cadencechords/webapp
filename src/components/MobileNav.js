import AppMenu from './mobile menus/AppMenu';
import MenuIcon from '@heroicons/react/solid/MenuIcon';
import MobileNavLink from './MobileNavLink';
import SearchIcon from '@heroicons/react/solid/SearchIcon';
import UserIcon from '@heroicons/react/solid/UserIcon';
import { useState } from 'react';
import MusicNoteIcon from '@heroicons/react/solid/MusicNoteIcon';
import PlaylistIcon from '../icons/PlaylistIcon';

export default function MobileNav() {
  const [showMenuDialog, setShowMenuDialog] = useState(false);

  const iconClasses = 'h-6 w-6';
  return (
    <>
      <div className="fixed bottom-0 z-40 flex w-full py-1 bg-white border-t dark:bg-dark-gray-800 dark:border-0 md:hidden">
        <MobileNavLink
          icon={<MusicNoteIcon className={iconClasses} />}
          to="/songs"
          text="Songs"
        />
        <MobileNavLink
          icon={<PlaylistIcon className="w-7 h-7" />}
          to="/sets"
          text="Sets"
        />
        <MobileNavLink
          icon={<MenuIcon className={iconClasses} />}
          onClick={() => setShowMenuDialog(true)}
          text="Menu"
        />
        <MobileNavLink
          icon={<SearchIcon className={iconClasses} />}
          to="/search"
          text="Search"
        />
        <MobileNavLink
          icon={<UserIcon className={iconClasses} />}
          to="/account"
          text="Account"
        />
      </div>
      <AppMenu
        open={showMenuDialog}
        onCloseDialog={() => setShowMenuDialog(false)}
      />
    </>
  );
}
