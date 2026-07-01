import Divider from '@/components/layout/divider';
import { type DividerType } from '@/components/layout/divider-sections';
import type { ComponentConfig } from '@puckeditor/core';

import { SlotPuck } from '../components/slot-puck';

export type SectionBlockProps = {
  backgroundImage: string;
  backgroundColor: string;
  imagePosition: 'left' | 'center' | 'right';
  paddingTop: number;
  paddingBottom: number;
  dividerTopType?: string;
  dividerTopClassName?: string;
  dividerBottomType?: string;
  dividerBottomClassName?: string;
  contentClassName?: string;
  slot: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export const SectionBlock = (): ComponentConfig<SectionBlockProps> => {
  // const { isEditing } = useEditorMode();

  return {
    label: 'Seção',
    fields: {
      // 🖼️ background image
      backgroundImage: {
        type: 'text', // pode trocar por image field depois
        label: 'Background Image URL',
      },

      // 🎨 background color
      backgroundColor: {
        type: 'text',
        label: 'Background Color',
      },

      // ↔️ posição da imagem
      imagePosition: {
        type: 'radio',
        label: 'Image Position',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
      },

      // 📏 padding
      paddingTop: {
        type: 'number',
        label: 'Padding Top',
      },
      paddingBottom: {
        type: 'number',
        label: 'Padding Bottom',
      },

      // 🔝 Divider Top
      dividerTopType: {
        type: 'select',
        label: 'Divider Top Type',
        options: [
          { label: 'Nenhum', value: '' },
          { label: 'Type 01', value: 'type01' },
          { label: 'Type 02', value: 'type02' },
          { label: 'Type 03', value: 'type03' },
          { label: 'Type 04', value: 'type04' },
          { label: 'Type 05', value: 'type05' },
          { label: 'Type 06', value: 'type06' },
          { label: 'Type 07', value: 'type07' },
          { label: 'Type 08', value: 'type08' },
          { label: 'Type 09', value: 'type09' },
          { label: 'Type 10', value: 'type10' },
        ],
      },
      dividerTopClassName: {
        type: 'text',
        label: 'Divider Top Class Name',
      },

      // 🔽 Divider Bottom
      dividerBottomType: {
        type: 'select',
        label: 'Divider Bottom Type',
        options: [
          { label: 'Nenhum', value: '' },
          { label: 'Type 01', value: 'type01' },
          { label: 'Type 02', value: 'type02' },
          { label: 'Type 03', value: 'type03' },
          { label: 'Type 04', value: 'type04' },
          { label: 'Type 05', value: 'type05' },
          { label: 'Type 06', value: 'type06' },
          { label: 'Type 07', value: 'type07' },
          { label: 'Type 08', value: 'type08' },
          { label: 'Type 09', value: 'type09' },
          { label: 'Type 10', value: 'type10' },
        ],
      },
      dividerBottomClassName: {
        type: 'text',
        label: 'Divider Bottom Class Name',
      },

      // 📦 Content Wrapper
      contentClassName: {
        type: 'text',
        label: 'Content Class Name (opcional)',
      },

      slot: {
        type: 'slot',
        disallow: ['Section'],
      },
    },

    defaultProps: {
      backgroundImage: '',
      backgroundColor: '#ffffff',
      imagePosition: 'center',
      paddingTop: 80,
      paddingBottom: 80,
      dividerTopType: '',
      dividerTopClassName: '',
      dividerBottomType: '',
      dividerBottomClassName: '',
      contentClassName: '',
      slot: [],
    },

    render: ({
      backgroundImage,
      backgroundColor,
      imagePosition,
      paddingTop,
      paddingBottom,
      dividerTopType,
      dividerTopClassName,
      dividerBottomType,
      dividerBottomClassName,
      contentClassName,
      slot: Slot,
    }) => {
      return (
        <section
          className={`w-full bg-cover bg-no-repeat`}
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundPosition: imagePosition,
            backgroundColor: backgroundColor || '#ffffff',
          }}
        >
          {/* Divider Top */}
          {dividerTopType && (
            <Divider
              type={dividerTopType as DividerType}
              flipY={true}
              fitTo="top"
              className={`mt-[-2px] ${dividerTopClassName}`}
            />
          )}

          {/* -------------------------  
            CENTERED CONTENT WRAPPER  
           ------------------------- */}
          <div
            className={`mx-auto flex w-full flex-col items-center px-4 ${contentClassName}`}
            style={{
              paddingTop: `${paddingTop}px`,
              paddingBottom: `${paddingBottom}px`,
            }}
          >
            {/* <Slot className={`${isEditing ? 'p-2' : ''}`} /> */}
            <SlotPuck Slot={Slot} style={{ gap: '4rem' }} />
          </div>

          {/* Divider Bottom */}
          {dividerBottomType && (
            <Divider
              type={dividerBottomType as DividerType}
              fitTo="bottom"
              className={dividerBottomClassName}
            />
          )}
        </section>
      );
    },
  };
};
