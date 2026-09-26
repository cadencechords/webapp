import 'react-alice-carousel/lib/alice-carousel.css';

import AliceCarousel from 'react-alice-carousel';
import SongsCarouselSlide from './SongsCarouselSlide';
import { useState } from 'react';
import usePerformanceMode from '../hooks/usePerformanceMode';
import type { ComponentProps } from 'react';
import type { PresentedSong } from '../store/presenterSlice';

type SongsCarouselProps = {
  songs: PresentedSong[];
  index: number;
  onIndexChange: (index: number) => void;
  onSongUpdate: ComponentProps<typeof SongsCarouselSlide>['onSongUpdate'];
};

export default function SongsCarousel({
  songs,
  index,
  onIndexChange,
  onSongUpdate,
}: SongsCarouselProps) {
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
