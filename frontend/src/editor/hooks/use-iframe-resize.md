# `useIframeResize`

Hook used by external components rendered inside an iframe to report their own height to the parent page.

## Why this exists

Some external content are built in React and rendered inside an iframe. Their height depends on the content, so a fixed height does not work well.

This hook measures the component container and sends the current height to the parent window using `postMessage`.

Works together with `useHtmlBlockAutoResize()` from Klyro to synchronize the height.

## Hook to use in external content

```ts
import { useEffect, useRef } from 'react';

type UseIframeResizeOptions = {
  iframeId: string;
};

export function useIframeResize({ iframeId }: UseIframeResizeOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sendHeight = () => {
      const height = containerRef.current?.scrollHeight ?? document.body.scrollHeight;

      window.parent.postMessage(
        {
          type: 'iframe-resize',
          iframeId,
          height,
        },
        '*'
      );
    };

    sendHeight();

    const observer = new ResizeObserver(() => {
      sendHeight();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('load', sendHeight);
    window.addEventListener('resize', sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('load', sendHeight);
      window.removeEventListener('resize', sendHeight);
    };
  }, [iframeId]);

  return containerRef;
}
```

## Usage example

```tsx
import { useIframeResize } from './use-iframe-resize';

export default function MultipleChoices() {
  const quizRef = useIframeResize({ iframeId: 'quiz-1' });

  return (
    <div ref={quizRef} className="py-10">
      {/* quiz content */}
    </div>
  );
}
```

## Iframe markup

The parent HTML that renders the iframe should include the same `iframeId` so the resize message can be matched correctly.

```html
<iframe
  data-iframe-id="quiz-1"
  src="https://example.com/quiz"
  frameborder="0"
  allowfullscreen
  allow="fullscreen"
  style="border: none; width: 100%; display: block; margin: 0"
></iframe>
```

## Message format

The iframe should send messages in this shape:

```ts
window.parent.postMessage(
  {
    type: 'iframe-resize',
    iframeId: 'quiz-1',
    height: document.body.scrollHeight,
  },
  '*'
);
```

## Notes

- Same-origin iframes can often be measured directly.
- Cross-origin quizzes should send `postMessage` updates from inside the iframe.
- `iframeId` must match the `data-iframe-id` attribute used by the parent.
