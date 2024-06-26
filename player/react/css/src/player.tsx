import '@vidstack/react/player/styles/base.css';

import { useEffect, useRef } from 'react';

import styles from './player.module.css';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';
import { textTracks } from './tracks';

export function Player() {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', state.paused);
      // console.log('is audio view?', '->', state.viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
    // ...
  }

  return (
    <MediaPlayer
      className={`${styles.player} player`}
      title="Sprite Fight"
      src="https://files.vidstack.io/sprite-fight/720p.mp4"
      crossOrigin
      playsInline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
    >
      <MediaProvider>
        <Poster
          class={styles.poster}
          src="https://files.vidstack.io/sprite-fight/poster.webp"
          alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
        />
        {textTracks.map((track) => (
          <Track {...track} key={track.src} />
        ))}
      </MediaProvider>

      <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
    </MediaPlayer>
  );
}
