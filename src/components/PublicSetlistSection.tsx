import { useSelector } from 'react-redux';
import SetlistApi from '../api/SetlistApi';
import { selectCurrentMember } from '../store/authSlice';
import { PUBLISH_SETLISTS } from '../utils/constants';
import { reportError } from '../utils/error';
import ShareLinkCard from './ShareLinkCard';
import type { Setlist } from '../types';

const PUBLIC_URL = import.meta.env.REACT_APP_PUBLIC_URL;

type PublicSetlistSectionProps = {
  setlist: Setlist;
  onChange: (publicLinkEnabled: boolean) => void;
};

export default function PublicSetlistSection({
  setlist,
  onChange,
}: PublicSetlistSectionProps) {
  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;

  async function handleTogglePublicLink() {
    try {
      const updates = { publicLinkEnabled: !setlist.public_link_enabled };
      onChange(updates.publicLinkEnabled);
      await SetlistApi.updateOne(updates, setlist.id);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <ShareLinkCard
      title="Public link"
      description="Anyone with this link can see this set, without signing in."
      link={`${PUBLIC_URL}/setlists/${setlist.public_link}`}
      enabled={!!setlist.public_link_enabled}
      // Only members who can publish sets turn it on and off.
      onToggle={
        currentMember.can(PUBLISH_SETLISTS) ? handleTogglePublicLink : undefined
      }
      className="mt-12"
    />
  );
}
