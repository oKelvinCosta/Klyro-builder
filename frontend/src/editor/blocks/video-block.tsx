import Container from '@/components/layout/container';
import {
  CONTAINER_MAP,
  ContainerField,
  type ContainerVariant,
} from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';

/**
 * Props accepted by the Video block.
 */
export type VideoBlockProps = {
  /**
   * Original video URL entered by the user.
   */
  url: string;
  /**
   * Fallback aspect ratio used by the wrapper around the iframe.
   */
  aspectRatio: '16 / 9' | '4 / 3' | '1 / 1' | '21 / 9';
  /**
   * Container width preset used by the block.
   */
  container: ContainerVariant;
};

/**
 * Maps the aspect ratio selection to the CSS value used by the wrapper.
 */
const ASPECT_RATIO_MAP = {
  '16 / 9': '16 / 9',
  '4 / 3': '4 / 3',
  '1 / 1': '1 / 1',
  '21 / 9': '21 / 9',
} as const;

/**
 * Normalizes a raw URL before embed conversion.
 *
 * This is mainly used to unwrap Google redirect URLs and recover the real
 * destination that the user originally intended to embed.
 */
function normalizeVideoUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);

    if (url.hostname.replace(/^www\./, '') === 'google.com' && url.pathname === '/url') {
      const redirectedUrl = url.searchParams.get('q') || url.searchParams.get('url');
      if (redirectedUrl) {
        return redirectedUrl;
      }
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

/**
 * Converts a supported video URL into the correct iframe embed URL.
 *
 * Supported formats include:
 * - YouTube watch URLs
 * - YouTube Shorts URLs
 * - YouTube embed URLs
 * - Vimeo URLs
 * - Already embedded URLs
 */
function toEmbedUrl(rawUrl: string) {
  try {
    const normalizedUrl = normalizeVideoUrl(rawUrl);
    const url = new URL(normalizedUrl);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : rawUrl;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const embedMatch = url.pathname.match(/\/embed\/([^/?]+)/i);
      if (embedMatch?.[1]) {
        return `https://www.youtube.com/embed/${embedMatch[1]}`;
      }

      const shortsMatch = url.pathname.match(/\/shorts\/([^/?]+)/i);
      if (shortsMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortsMatch[1]}`;
      }

      const videoId = url.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const embedMatch = url.pathname.match(/\/video\/(\d+)/i);
      if (embedMatch?.[1]) {
        return `https://player.vimeo.com/video/${embedMatch[1]}`;
      }

      const regularMatch = url.pathname.match(/^\/(\d+)/);
      if (regularMatch?.[1]) {
        return `https://player.vimeo.com/video/${regularMatch[1]}`;
      }
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

/**
 * Editor block that renders a responsive video iframe from a user-provided URL.
 */
export const VideoBlock: ComponentConfig<VideoBlockProps> = {
  fields: {
    url: {
      type: 'text',
      label: 'Video URL',
    },
    aspectRatio: {
      type: 'select',
      label: 'Fallback Aspect Ratio',
      options: [
        { label: '16:9', value: '16 / 9' },
        { label: '4:3', value: '4 / 3' },
        { label: '1:1', value: '1 / 1' },
        { label: '21:9', value: '21 / 9' },
      ],
    },
    container: ContainerField(),
  },
  defaultProps: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    aspectRatio: '16 / 9',
    container: '980' as ContainerVariant,
  },
  render: ({ url, aspectRatio, container }) => {
    const embedUrl = toEmbedUrl(url);

    return (
      <Container style={{ maxWidth: CONTAINER_MAP[container as ContainerVariant].maxWidth }}>
        <div
          className="w-full overflow-hidden rounded-lg"
          style={{ aspectRatio: ASPECT_RATIO_MAP[aspectRatio] }}
        >
          <iframe
            src={embedUrl}
            title="Video player"
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </Container>
    );
  },
};
