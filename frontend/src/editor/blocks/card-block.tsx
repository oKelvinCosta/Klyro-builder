// @/components/puck/ImgBlock.tsx
import MainCard from '@/components/main-card';
import type { ComponentConfig } from '@puckeditor/core';
import { SlotPuck } from '../utils/slot-puck';

export type CardBlockProps = {
  imgSrc?: string;
  title?: string;
  horizontal?: boolean;
  side?: 'left' | 'right';
  content?: undefined;
  textSize?: 16 | 18 | 24;
  variant?: 'default' | 'gray';
  slot?: undefined[];
};

export const CardBlock: ComponentConfig<CardBlockProps> = {
  fields: {
    imgSrc: { type: 'text' },
    title: { type: 'text' },
    horizontal: {
      type: 'radio',
      options: [
        { label: 'Vertical', value: false },
        { label: 'Horizontal', value: true },
      ],
    },
    side: {
      type: 'radio',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    content: {
      type: 'richtext',
    },
    textSize: {
      type: 'radio',
      options: [
        { label: 'Small', value: 16 },
        { label: 'Medium', value: 18 },
        { label: 'Large', value: 24 },
      ],
    },
    variant: {
      type: 'radio',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Gray', value: 'gray' },
      ],
    },
    slot: {
      type: 'slot',
    },
  },
  defaultProps: {
    title: 'Card Title',
    content: 'Card content goes here...',
    horizontal: false,
    side: 'left',
    textSize: 16,
    variant: 'default',
    imgSrc: '',
    slot: [],
  },
  render: ({ imgSrc, title, horizontal, side, content, textSize, variant, slot: Slot }) => {
    return (
      <MainCard
        imgSrc={imgSrc || undefined}
        title={title}
        horizontal={horizontal}
        side={side}
        textSize={textSize}
        variant={variant}
      >
        {content}
        {Slot && Slot.length > 0 ? <SlotPuck Slot={Slot} className="mt-4 gap-4" /> : ''}
      </MainCard>
    );
  },
};
