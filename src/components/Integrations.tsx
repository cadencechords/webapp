import Button from './Button';
import PcoApi from '../api/PlanningCenterApi';
import SectionTitle from './SectionTitle';
import { reportError } from '../utils/error';
import { setCurrentUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { SettingsRow, SettingsRowText } from './settings/SettingsRow';
import type { User } from '../types';

type IntegrationsProps = {
  currentUser: User;
};

// The account's integrations, as a segmented list: each one says whether
// it's connected, with Disconnect at its end when it is.
export default function Integrations({ currentUser }: IntegrationsProps) {
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
    <section className="mb-8">
      <SectionTitle title="Integrations" />
      <div className="list-segmented">
        <SettingsRow>
          <SettingsRowText
            leading={
              // Planning Center Services' app icon, as on the import page.
              <img
                src="/services.png"
                width="40"
                height="40"
                alt=""
                className="w-10 h-10 shrink-0"
              />
            }
            title="Planning Center"
            description={
              currentUser.pco_connected ? 'Connected' : 'Not connected'
            }
          />
          {currentUser.pco_connected && (
            <Button
              size="sm"
              variant="open"
              color="blue"
              onClick={handleDisconnectPco}
              loading={isDisconnectingPco}
              className="shrink-0 -mr-2"
            >
              Disconnect
            </Button>
          )}
        </SettingsRow>
      </div>
    </section>
  );
}
