<script lang="ts">
  // Import styles.
  import 'vidstack/player/styles/default/theme.css';
  // Register elements.
  import 'vidstack/player';
  import 'vidstack/player/ui';
  import 'vidstack/icons';

  import { onMount } from 'svelte';
  import {
    isHLSProvider,
    type MediaCanPlayEvent,
    type MediaProviderChangeEvent,
    type MediaViewType,
  } from 'vidstack';
  import type { MediaPlayerElement } from 'vidstack/elements';

  import AudioLayout from './components/layouts/AudioLayout.svelte';
  import VideoLayout from './components/layouts/VideoLayout.svelte';
  import { textTracks } from './tracks';

  let player: MediaPlayerElement,
    src = '',
    viewType: MediaViewType = 'unknown';

  // Initialize src.
  changeSource('audio');

  onMount(() => {
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
    for (const track of textTracks) player.textTracks.add(track);

    // Subscribe to state updates.
    return player.subscribe((state) => {
      viewType = state.viewType;
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
        src = 'https://files.vidstack.io/sprite-fight/audio.mp3';
        break;
      case 'video':
        src = 'https://files.vidstack.io/sprite-fight/720p.mp4';
        break;
      case 'hls':
        src = 'https://files.vidstack.io/sprite-fight/hls/stream.m3u8';
        break;
      case 'youtube':
        src = 'youtube/_cMxraX_5RE';
        break;
      case 'vimeo':
        src = 'vimeo/640499893';
        break;
    }
  }
</script>

<media-player
  class="player"
  title="Sprite Fight"
  {src}
  crossOrigin
  playsInline
  on:provider-change={onProviderChange}
  on:can-play={onCanPlay}
  bind:this={player}
>
  <media-provider>
    {#if viewType === 'video'}
      <media-poster
        class="vds-poster"
        src="https://files.vidstack.io/sprite-fight/poster.webp"
        alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
      />
    {/if}
  </media-provider>
  <!-- Layouts -->
  {#if viewType === 'audio'}
    <AudioLayout />
  {:else if viewType === 'video'}
    <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
  {/if}
</media-player>

<div class="src-buttons">
  <button on:click={() => changeSource('audio')}>Audio</button>
  <button on:click={() => changeSource('video')}>Video</button>
  <button on:click={() => changeSource('hls')}>HLS</button>
  <button on:click={() => changeSource('youtube')}>YouTube</button>
  <button on:click={() => changeSource('vimeo')}>Vimeo</button>
</div>

<style lang="postcss">
  .player {
    --media-brand: #f5f5f5;
    --media-focus-ring-color: #4e9cf6;
    --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);

    &[data-view-type='audio'] {
      --media-tooltip-y-offset: 44px;
      --media-menu-y-offset: 40px;
      --media-slider-chapter-title-color: black;
      --media-border-radius: 4px;
      background-color: #212121;
      border-radius: var(--media-border-radius);
      contain: layout;
    }

    &[data-view-type='video'] {
      --media-tooltip-y-offset: 30px;
      --media-menu-y-offset: 30px;
      aspect-ratio: 16 /9;
      background-color: #212121;
      border-radius: var(--media-border-radius);
      contain: layout;
    }

    & :global(video),
    media-poster {
      border-radius: var(--media-border-radius);
    }
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
