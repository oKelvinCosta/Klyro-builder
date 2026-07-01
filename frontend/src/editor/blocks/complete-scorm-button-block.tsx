// @/components/puck/CompleteScormButtonBlock.tsx
import CompleteScormButton from '@/components/complete-scorm-button';
import type { ComponentConfig } from '@puckeditor/core';

export type CompleteScormButtonBlockProps = {
  content: string;
  alignment: 'left' | 'center' | 'right';
};

export const CompleteScormButtonBlock: ComponentConfig<CompleteScormButtonBlockProps> = {
  label: 'Botão SCORM',
  fields: {
    content: {
      type: 'text',
    },
    alignment: {
      type: 'radio',
      options: [
        { label: 'left', value: 'left' },
        { label: 'center', value: 'center' },
        { label: 'right', value: 'right' },
      ],
    },
  },
  defaultProps: {
    content: 'Button',
    alignment: 'left',
  },
  render: ({ content, alignment }) => {
    const alignmentClasses = {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto',
    };
    return <CompleteScormButton text={content} className={alignmentClasses[alignment]} />;
  },
};
