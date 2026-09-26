import 'react-alice-carousel/lib/alice-carousel.css';

import AliceCarousel from 'react-alice-carousel';
import SongsCarouselSlide from './SongsCarouselSlide';
import { useState } from 'react';
import usePerformanceMode from '../hooks/usePerformanceMode';

export default function SongsCarousel({
  songs,
  index,
  onIndexChange,
  onSongUpdate,
}) {
  const { isPerforming } = usePerformanceMode();
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  function buildTemplates() {
    return songs?.map(song => (
      <SongsCarouselSlide
        key={song.id}
        song={song}
        onEnableSwipe={() => setIsSwipeEnabled(true)}
        onDisableSwipe={() => setIsSwipeEnabled(false)}
        onSongUpdate={onSongUpdate}
      />
    ));
  }

  return (
    <>
      <AliceCarousel
        mouseTracking={false}
        touchTracking={isSwipeEnabled && isPerforming}
        disableButtonsControls
        disableDotsControls
        disableSlideInfo
        items={buildTemplates()}
        onSlideChanged={e => onIndexChange(e.slide)}
        activeIndex={index}
        swipeDelta={100}
        autoHeight
        animationDuration={400}
      />
    </>
  );
}
