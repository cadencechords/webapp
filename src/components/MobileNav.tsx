import AppMenu from './mobile menus/AppMenu';
import MobileNavLink from './MobileNavLink';
import { useState } from 'react';
import PlaylistIcon from '../icons/PlaylistIcon';
import Icon from './Icon';

export default function MobileNav() {
  const [showMenuDialog, setShowMenuDialog] = useState(false);

  const iconClasses = 'h-6 w-6';
  return (
    <>
      <div className="fixed bottom-0 z-40 flex w-full py-1 bg-white border-t dark:bg-dark-gray-800 dark:border-0 md:hidden">
        <MobileNavLink
          icon={<Icon name="music_note" filled className={iconClasses} />}
          to="/songs"
          text="Songs"
        />
        <MobileNavLink
          icon={<PlaylistIcon className="w-7 h-7" />}
          to="/sets"
          text="Sets"
        />
        <MobileNavLink
          icon={<Icon name="menu" filled className={iconClasses} />}
          onClick={() => setShowMenuDialog(true)}
          text="Menu"
        />
        <MobileNavLink
          icon={<Icon name="search" filled className={iconClasses} />}
          to="/search"
          text="Search"
        />
        <MobileNavLink
          icon={<Icon name="person" filled className={iconClasses} />}
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
