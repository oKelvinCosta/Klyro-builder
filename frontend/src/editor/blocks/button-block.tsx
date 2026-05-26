import { Button } from '@/components/ui/button';
import { AlignmentXField } from '@/editor/fields';
import { cn } from '@/lib/utils';
import type { ComponentConfig } from '@puckeditor/core';
import { RichTextMenu } from '@puckeditor/core';

export type ButtonBlockProps = {
  content: string;
  link: string;
  alignment: 'left' | 'center' | 'right';
  color: 'primary' | 'secondary' | 'tertiary' | 'custom';

  style: 'link' | 'solid' | 'outline';
  size: 'default' | 'lg' | 'sm';
  customBgColor?: string;
  customTextColor?: string;
};

export const ButtonBlock: ComponentConfig<ButtonBlockProps> = {
  fields: {
    content: {
      type: 'richtext',
      renderMenu: () => (
        <RichTextMenu>
          <RichTextMenu.Group>
            <RichTextMenu.Italic />
          </RichTextMenu.Group>
        </RichTextMenu>
      ),
    },
    link: {
      type: 'text',
      label: 'Link URL',
    },
    alignment: AlignmentXField(),
    color: {
      label: 'Cor',
      type: 'radio',
      options: [
        { label: 'Primária', value: 'primary' },
        { label: 'Secundária', value: 'secondary' },
        { label: 'Terciária', value: 'tertiary' },
        { label: 'Personalizado', value: 'custom' },
      ],
    },
    style: {
      label: 'Estilo',
      type: 'radio',
      options: [
        { label: 'Sólido', value: 'solid' },
        { label: 'Contorno', value: 'outline' },
        { label: 'Link', value: 'link' },
      ],
    },
    size: {
      label: 'Tamanho',
      type: 'radio',
      options: [
        { label: 'Grande', value: 'lg' },
        { label: 'Padrão', value: 'default' },
        { label: 'Pequeno', value: 'sm' },
      ],
    },
  },
  resolveFields: (data, { fields }) => {
    if (data.props.color === 'custom') {
      const { content, link, alignment, color, style, size } = fields;
      return {
        content,
        link,
        alignment,
        color,
        customBgColor: {
          type: 'text',
          label: 'Cor de Fundo (Hex/HSL)',
        },
        customTextColor: {
          type: 'text',
          label: 'Cor do Texto (Hex/HSL)',
        },
        style,
        size,
      };
    }
    return fields;
  },
  defaultProps: {
    content: 'Botão',
    link: '',
    alignment: 'left',
    color: 'primary',
    style: 'solid',
    size: 'default',
  },
  render: ({ content, link, alignment, color, size, style, customBgColor, customTextColor }) => {
    const alignmentClasses = {
      left: 'mr-auto',
      center: 'mx-auto',
      right: 'ml-auto',
    };

    const styleCss = {
      backgroundColor: customBgColor || undefined,
      color: customTextColor || undefined,
      borderColor: style === 'outline' ? customTextColor : undefined,
    };

    const buttonElement = (
      <Button
        canvasColor={color}
        canvasStyle={style}
        canvasSize={size}
        className={cn(alignmentClasses[alignment], 'transition-opacity hover:opacity-80')}
        style={styleCss}
      >
        {content}
      </Button>
    );

    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block">
          {buttonElement}
        </a>
      );
    }

    return buttonElement;
  },
};
