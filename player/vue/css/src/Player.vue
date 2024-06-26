<script lang="ts" setup>
// Import styles.
import 'vidstack/player/styles/base.css';
import './buttons.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/icons';

import { isHLSProvider, type MediaCanPlayEvent, type MediaProviderChangeEvent } from 'vidstack';
import type { MediaPlayerElement } from 'vidstack/elements';
import { onMounted, ref } from 'vue';

import VideoLayout from './components/layouts/VideoLayout.vue';
import { textTracks } from './tracks';

const $player = ref<MediaPlayerElement>();

onMounted(() => {
  /**
   * You can add these tracks using HTML as well.
   *
   * @example
   * ```html
   * <media-provider>
   *   <track label="..." src="..." kind="..." srclang="..." default />
   *   <track label="..." src="..." kind="..." srclang="..." />
   * </media-provider>
   * ```
   */
  for (const track of textTracks) $player.value!.textTracks.add(track);

  // Subscribe to state updates - you can connect them to Vue refs if needed.
  return $player.value!.subscribe(({ paused, viewType }) => {
    // console.log('is paused?', '->', paused);
    // console.log('is audio view?', '->', viewType === 'audio');
  });
});

function onProviderChange(event: MediaProviderChangeEvent) {
  const provider = event.detail;
  // We can configure provider's here.
  if (isHLSProvider(provider)) {
    provider.config = {};
  }
}

// We can listen for the `can-play` event to be notified when the player is ready.
function onCanPlay(event: MediaCanPlayEvent) {
  // ...
}
</script>

<template>
  <media-player
    class="player"
    title="Sprite Fight"
    src="https://files.vidstack.io/sprite-fight/720p.mp4"
    crossOrigin
    playsInline
    @provider-change="onProviderChange"
    @can-play="onCanPlay"
    ref="$player"
  >
    <media-provider>
      <media-poster
        class="poster"
        src="https://files.vidstack.io/sprite-fight/poster.webp"
        alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
      />
    </media-provider>

    <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
  </media-player>
</template>

<style scoped>
.player {
  --media-brand: #f5f5f5;
  --media-focus-ring-color: #4e9cf6;
  --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);

  --media-tooltip-y-offset: 30px;
  --media-menu-y-offset: 30px;

  aspect-ratio: 16 /9;
  background-color: #212121;
  border-radius: var(--media-border-radius);
  color: #f5f5f5;
  contain: layout;
  font-family: sans-serif;
  overflow: hidden;
}

.player[data-focus]:not([data-playing]) {
  box-shadow: var(--media-focus-ring);
}

.player :deep(video),
.poster {
  border-radius: var(--media-border-radius);
}

.poster {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
}

.poster :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster[data-visible] {
  opacity: 1;
}
</style>
