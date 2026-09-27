import AnnouncementIcon from '../icons/AnnouncementIcon';
import Button from './Button';
import FeedbackApi from '../api/FeedbackApi';
import StyledPopover from './StyledPopover';
import { reportError } from '../utils/error';
import { selectCurrentUser, selectTeamId } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function FeedbackPopover() {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  // Non-null (both): the Navbar renders under SecuredRoutes, which renders
  // only once the current user and team load, and a team loads only when
  // there's a team id.
  const teamId = useSelector(selectTeamId)!;
  const currentUser = useSelector(selectCurrentUser)!;

  const button = (
    <AnnouncementIcon className="mr-8 text-gray-600 transform w-7 h-7 -rotate-3 dark:text-dark-gray-200" />
  );

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await FeedbackApi.create({
        team_id: teamId,
        text: feedback,
        email: currentUser.email,
        platform: 'web',
      });
      setFeedback('');
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = () => {
    return feedback && feedback !== '';
  };

  return (
    <>
      <StyledPopover position="bottom-start" button={button}>
        <textarea
          className="block p-4 w-72 min-h-24 bg-transparent resize-y outline-hidden focus:outline-hidden font-plain text-body-large text-on-surface placeholder:text-on-surface-variant caret-primary"
          placeholder="Submit feedback"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
        />
        <div className="px-2 py-2 text-right border-t border-outline-variant">
          <Button
            onClick={handleSubmit}
            color="blue"
            size="xs"
            loading={loading}
            disabled={!isValid()}
          >
            Submit
          </Button>
        </div>
      </StyledPopover>
    </>
  );
}
