import { useEffect, type RefObject } from 'react';

type IframeResizeMessage = {
  type: 'iframe-resize';
  iframeId?: string;
  height: number;
};

/**
 * Keeps iframe height in sync with its content when possible.
 *
 * Same-origin iframes are measured directly, while cross-origin quizzes can
 * opt into resizing by sending a postMessage event.
 */
export function useHtmlBlockAutoResize(
  rootRef: RefObject<HTMLDivElement | null>,
  dependencies: unknown[] = []
) {
  useEffect(() => {
    // Stop early if the HTML container is not mounted yet.
    const root = rootRef.current;
    if (!root) return;

    // Apply a calculated height to the iframe and keep it full width.
    const applyIframeHeight = (iframe: HTMLIFrameElement, height: number) => {
      if (height <= 0) return;

      iframe.style.height = `${height}px`;
      iframe.style.width = '100%';
      iframe.style.display = 'block';
    };

    const measureIframe = (iframe: HTMLIFrameElement) => {

      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        const body = doc.body;
        const html = doc.documentElement;
        const height = Math.max(
          body?.scrollHeight ?? 0,
          html?.scrollHeight ?? 0,
          body?.offsetHeight ?? 0,
          html?.offsetHeight ?? 0
        );

        applyIframeHeight(iframe, height);
      } catch {
        // Cross-origin iframes cannot be measured directly.
      }
    };

    // Measure every iframe currently rendered inside the HTML content.
    const measureAllIframes = () => {
      root.querySelectorAll('iframe').forEach((iframe) => measureIframe(iframe));
    };

    // Listen for resize messages sent from content running inside the iframe.
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as Partial<IframeResizeMessage> | undefined;
      if (!data || data.type !== 'iframe-resize' || typeof data.height !== 'number') return;

      const target = root.querySelector<HTMLIFrameElement>(
        `iframe[data-iframe-id="${String(data.iframeId ?? '')}"]`
      );

      if (target) {
        applyIframeHeight(target, data.height);
      }
    };

    // Re-run measurements whenever the HTML content changes.
    const observer = new MutationObserver(() => measureAllIframes());
    observer.observe(root, { childList: true, subtree: true });

    // Assign a default iframe id when the HTML does not provide one.
    const iframes = Array.from(root.querySelectorAll('iframe'));
    iframes.forEach((iframe, index) => {
      if (!iframe.dataset.iframeId) {
        iframe.dataset.iframeId = `${index}`;
      }

      // Once the iframe loads, try to measure it immediately.
      const handleLoad = () => measureIframe(iframe);
      iframe.addEventListener('load', handleLoad);
      handleLoad();
    });

    // Run an initial pass and keep listening for resize messages.
    measureAllIframes();
    window.addEventListener('message', handleMessage);

    return () => {
      // Clean up observers and message listeners when the component unmounts.
      observer.disconnect();
      window.removeEventListener('message', handleMessage);
    };
  }, dependencies);
}


