import React from 'react';
import PageTitle from './PageTitle';
import MobileHeader from './MobileHeader';

export default function PageHeader({
  title,
  headerRight,
  onHeaderRightClick,
  headerRightDisabled,
  headerRightVisible,
}) {
  return (
    <div>
      <div className="hidden sm:block">
        <PageTitle title={title} className="px-0 mb-2" />
      </div>
      <div className="mb-2 sm:hidden h-14">
        <MobileHeader
          title={title}
          className="shadow-inner"
          onAdd={onHeaderRightClick}
          canAdd={headerRightVisible}
        />
      </div>
    </div>
  );
}
