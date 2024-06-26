<script lang="ts">
  // Import styles.
  import 'vidstack/player/styles/default/theme.css';
  import 'vidstack/player/styles/default/layouts/audio.css';
  import 'vidstack/player/styles/default/layouts/video.css';
  // Register elements.
  import 'vidstack/player';
  import 'vidstack/player/layouts';
  import 'vidstack/player/ui';

  import { onMount } from 'svelte';
  import { isHLSProvider, type MediaCanPlayEvent, type MediaProviderChangeEvent } from 'vidstack';
  import type { MediaPlayerElement } from 'vidstack/elements';

  import { textTracks } from './tracks';

  let player: MediaPlayerElement,
    src = '';

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
    return player.subscribe(({ paused, viewType }) => {
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
    <media-poster
      class="vds-poster"
      src="https://files.vidstack.io/sprite-fight/poster.webp"
      alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
    />
  </media-provider>
  <!-- Layouts -->
  <media-audio-layout />
  <media-video-layout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
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
    --brand-color: #f5f5f5;
    --focus-color: #4e9cf6;

    --audio-brand: var(--brand-color);
    --audio-focus-ring-color: var(--focus-color);
    --audio-border-radius: 2px;

    --video-brand: var(--brand-color);
    --video-focus-ring-color: var(--focus-color);
    --video-border-radius: 2px;

    /* 👉 https://vidstack.io/docs/player/components/layouts/default#css-variables for more. */

    &[data-view-type='audio'] media-poster {
      display: none;
    }

    &[data-view-type='video'] {
      aspect-ratio: 16 /9;
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
