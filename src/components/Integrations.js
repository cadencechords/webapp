import Button from './Button';
import PcoApi from '../api/PlanningCenterApi';
import SectionTitle from './SectionTitle';
import { reportError } from '../utils/error';
import { setCurrentUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Icon from './Icon';

export default function Integrations({ currentUser }) {
  const [isDisconnectingPco, setIsDisconnectingPco] = useState(false);
  const dispatch = useDispatch();

  const handleDisconnectPco = async () => {
    setIsDisconnectingPco(true);
    try {
      await PcoApi.disconnect();
      dispatch(setCurrentUser({ ...currentUser, pco_connected: false }));
    } catch (error) {
      reportError(error);
    } finally {
      setIsDisconnectingPco(false);
    }
  };

  return (
    <div className="mb-8">
      <SectionTitle title="Integrations" underline />
      <div className="flex-between">
        <div className="flex-center">
          {currentUser.pco_connected ? (
            <Icon
              name="check_circle"
              filled
              className="w-4 h-4 mr-2 text-green-500 dark:text-dark-green"
            />
          ) : (
            <Icon name="cancel" filled className="w-4 h-4 mr-2 text-gray-400" />
          )}
          Planning Center
        </div>
        {currentUser.pco_connected && (
          <Button
            size="xs"
            variant="open"
            color="blue"
            onClick={handleDisconnectPco}
            loading={isDisconnectingPco}
          >
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}
