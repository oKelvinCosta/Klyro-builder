// @/components/puck/ImgBlock.tsx
import type { ContainerVariant } from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';

export type EmbedBlockProps = {
  embedCode: string;
  width: string;
  height: string;
  container?: ContainerVariant;
};

export const EmbedBlock: ComponentConfig<EmbedBlockProps> = {
  fields: {
    embedCode: {
      type: 'textarea',
      label: 'Embed (iframe ou script)',
    },

    width: {
      type: 'text',
      label: 'Width',
    },

    height: {
      type: 'text',
      label: 'Height',
    },
  },

  defaultProps: {
    embedCode: '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" />',
    width: '100%',
    height: '400px',
  },

  render: ({ embedCode, width, height }) => {
    return (
      <div
        style={{
          width,
          height,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
          }}
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      </div>
    );
  },
};
