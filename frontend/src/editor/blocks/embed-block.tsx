import Container from '@/components/layout/container';
import {
  CONTAINER_MAP,
  ContainerField,
  type ContainerVariant,
} from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';
import { useRef } from 'react';
import { HtmlIframeInstructionsField } from '../fields/html-iframe-instructions-field';
import { useHtmlBlockAutoResize } from '../hooks/use-html-block-auto-resize';

export type EmbedBlockProps = {
  iframeInstructions?: undefined;
  content: string;
  container: ContainerVariant;
};

/**
 * Safely sanitizes raw HTML before rendering it inside the block.
 */
function sanitizeHtml(content: string) {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
}

/**
 * Renders sanitized HTML and keeps embedded iframes sized to their content.
 */
function EmbedBlockContent({ content }: { content: string }) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useHtmlBlockAutoResize(contentRef, [content]);

  return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />;
}

export const EmbedBlock: ComponentConfig<EmbedBlockProps> = {
  label: 'Embed',
  fields: {
    iframeInstructions: HtmlIframeInstructionsField(),
    content: {
      type: 'textarea',
      label: 'Embed Content',
    },
    container: ContainerField(),
  },
  defaultProps: {
    content: '<p>Embed Block</p>',
    container: '980' as ContainerVariant,
  },
  render: ({ content, container }) => {
    const sanitizedContent = sanitizeHtml(content);

    return (
      <Container style={{ maxWidth: CONTAINER_MAP[container as ContainerVariant].maxWidth }}>
        <EmbedBlockContent content={sanitizedContent} />
      </Container>
    );
  },
};
