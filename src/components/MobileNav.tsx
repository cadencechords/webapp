import AppMenu from './mobile menus/AppMenu';
import MobileNavLink from './MobileNavLink';
import { useState } from 'react';
import Icon from './Icon';

export default function MobileNav() {
  const [showMenuDialog, setShowMenuDialog] = useState(false);

  const iconClasses = 'h-6 w-6';
  return (
    <>
      {/* M3 Expressive navigation bar: 64dp on surface-container, no
          border, plus the home indicator's inset. Pages keep clear of it
          with bottom-[calc(4rem+env(safe-area-inset-bottom))]. */}
      <nav
        aria-label="Main"
        className="fixed bottom-0 z-40 flex items-center w-full h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-surface-container md:hidden"
      >
        <MobileNavLink
          icon={<Icon name="music_note" filled className={iconClasses} />}
          to="/songs"
          text="Songs"
        />
        <MobileNavLink
          icon={<Icon name="queue_music" filled className={iconClasses} />}
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
      </nav>
      <AppMenu
        open={showMenuDialog}
        onCloseDialog={() => setShowMenuDialog(false)}
      />
    </>
  );
}
