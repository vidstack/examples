<script lang="ts" setup>
// Import styles.
import 'vidstack/player/styles/default/theme.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/icons';

import {
  isHLSProvider,
  type MediaCanPlayEvent,
  type MediaProviderChangeEvent,
  type MediaViewType,
} from 'vidstack';
import type { MediaPlayerElement } from 'vidstack/elements';
import { onMounted, ref } from 'vue';

import AudioLayout from './components/layouts/AudioLayout.vue';
import VideoLayout from './components/layouts/VideoLayout.vue';
import { textTracks } from './tracks';

const $player = ref<MediaPlayerElement>(),
  $src = ref(''),
  $viewType = ref<MediaViewType>('unknown');

// Initialize src.
changeSource('audio');

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
    $viewType.value = viewType;
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

function changeSource(type: string) {
  switch (type) {
    case 'audio':
      $src.value = 'https://files.vidstack.io/sprite-fight/audio.mp3';
      break;
    case 'video':
      $src.value = 'https://files.vidstack.io/sprite-fight/720p.mp4';
      break;
    case 'hls':
      $src.value = 'https://files.vidstack.io/sprite-fight/hls/stream.m3u8';
      break;
    case 'youtube':
      $src.value = 'youtube/_cMxraX_5RE';
      break;
    case 'vimeo':
      $src.value = 'vimeo/640499893';
      break;
  }
}
</script>

<template>
  <media-player
    class="player"
    title="Sprite Fight"
    :src="$src"
    crossOrigin
    playsInline
    @provider-change="onProviderChange"
    @can-play="onCanPlay"
    ref="$player"
  >
    <media-provider>
      <media-poster
        v-if="$viewType === 'video'"
        class="vds-poster"
        src="https://files.vidstack.io/sprite-fight/poster.webp"
        alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
      />
    </media-provider>

    <AudioLayout v-if="$viewType === 'audio'" />
    <VideoLayout
      thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
      v-if="$viewType === 'video'"
    />
  </media-player>

  <div class="src-buttons">
    <button @click="changeSource('audio')">Audio</button>
    <button @click="changeSource('video')">Video</button>
    <button @click="changeSource('hls')">HLS</button>
    <button @click="changeSource('youtube')">YouTube</button>
    <button @click="changeSource('vimeo')">Vimeo</button>
  </div>
</template>

<style scoped>
.player {
  --media-brand: #f5f5f5;
  --media-focus-ring-color: #4e9cf6;
  --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);
}

.player[data-view-type='audio'] {
  --media-tooltip-y-offset: 44px;
  --media-menu-y-offset: 40px;
  --media-slider-chapter-title-color: black;
  --media-border-radius: 4px;
  background-color: #212121;
  border-radius: var(--media-border-radius);
  contain: layout;
}

.player[data-view-type='video'] {
  --media-tooltip-y-offset: 30px;
  --media-menu-y-offset: 30px;
  aspect-ratio: 16 /9;
  background-color: #212121;
  border-radius: var(--media-border-radius);
  contain: layout;
}

.player :deep(video),
media-poster {
  border-radius: var(--media-border-radius);
}

.src-buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 40px;
  margin-inline: auto;
  max-width: 300px;
}
</style>
