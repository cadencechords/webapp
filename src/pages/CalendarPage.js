import { ADD_EVENTS, VIEW_EVENTS } from '../utils/constants';
import { useEffect, useState } from 'react';

import Calendar from '../components/calendar/Calendar';
import eventsApi from '../api/eventsApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CalendarPage() {
  const currentSubscription = useSelector(selectCurrentSubscription);
  const currentMember = useSelector(selectCurrentMember);
  const router = useHistory();
  const [events, setEvents] = useState([]);

  useEffect(() => (document.title = 'Calendar'), []);

  useEffect(() => {
    if (
      (currentSubscription && !currentSubscription.isPro) ||
      (currentMember?.permissions && !currentMember.can(VIEW_EVENTS))
    ) {
      router.push('/');
    } else if (currentSubscription?.isPro && currentMember?.can(VIEW_EVENTS)) {
      fetchData();
    }
  }, [currentSubscription, router, currentMember]);

  async function fetchData() {
    try {
      let { data } = await eventsApi.getAll();
      setEvents(data);
    } catch (error) {
      reportError(error);
    }
  }

  function handleEventCreated(createdEvent) {
    setEvents(currentEvents => [...currentEvents, createdEvent]);
  }

  function handleEventDeleted(eventId) {
    setEvents(currentEvents =>
      currentEvents.filter(event => event.id !== eventId)
    );
  }

  function handleEventUpdated(updatedEvent) {
    setEvents(currentEvents =>
      currentEvents.map(eventInList =>
        eventInList.id === updatedEvent.id ? updatedEvent : eventInList
      )
    );
  }

  if (!currentSubscription || !currentMember) return null;
  else {
    return (
      <div>
        <Calendar
          canCreateEvents={currentMember?.can(ADD_EVENTS)}
          events={events}
          onEventCreated={handleEventCreated}
          onEventDeleted={handleEventDeleted}
          onEventUpdated={handleEventUpdated}
        />
      </div>
    );
  }
}
