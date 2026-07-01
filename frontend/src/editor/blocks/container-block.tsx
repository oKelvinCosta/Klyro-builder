import Container from '@/components/layout/container';
import {
  CONTAINER_MAP,
  ContainerField,
  type ContainerVariant,
} from '@/editor/fields/container-field';
import type { ComponentConfig } from '@puckeditor/core';
import { SlotPuck } from '../components/slot-puck';

export type ContainerBlockProps = {
  variant: ContainerVariant;
  slot: React.ReactNode;
};

export const ContainerBlock: ComponentConfig<ContainerBlockProps> = {
  label: 'Contêiner',
  fields: {
    variant: ContainerField(),
    slot: {
      type: 'slot',
      disallow: ['Container'],
    },
  },
  defaultProps: {
    variant: '780' as ContainerVariant,
    slot: [],
  },
  render: ({ variant, slot: Slot }) => {
    const SlotComponent = Slot as React.ElementType | undefined;

    return (
      <Container style={{ maxWidth: CONTAINER_MAP[variant].maxWidth }}>
        {SlotComponent ? <SlotPuck Slot={SlotComponent} style={{ gap: '4rem' }} /> : null}
      </Container>
    );
  },
};
