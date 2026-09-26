import type { ReactNode } from 'react';
import PageTitle from './PageTitle';
import MobileHeader from './MobileHeader';

type PageHeaderProps = {
  title?: string;
  /** Not read. */
  headerRight?: ReactNode;
  onHeaderRightClick?: () => void;
  /** Not read. */
  headerRightDisabled?: boolean;
  headerRightVisible?: boolean;
};

export default function PageHeader({
  title,
  headerRight,
  onHeaderRightClick,
  headerRightDisabled,
  headerRightVisible,
}: PageHeaderProps) {
  return (
    <div>
      <div className="hidden sm:block">
        <PageTitle title={title} className="px-0 mb-2" />
      </div>
      <div className="mb-2 sm:hidden h-14">
        <MobileHeader
          title={title}
          onAdd={onHeaderRightClick}
          canAdd={headerRightVisible}
        />
      </div>
    </div>
  );
}
