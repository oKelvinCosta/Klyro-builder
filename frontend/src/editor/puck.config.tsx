import * as Blocks from '@/editor/blocks';
import { type Config } from '@puckeditor/core';

type Props = {
  RichText: Blocks.RichTextBlockProps;
  Html: Blocks.HtmlBlockProps;
  Card: Blocks.CardBlockProps;
  Img: Blocks.ImgBlockProps;
  Grid: Blocks.GridBlockProps;
  Container: Blocks.ContainerBlockProps;
  Button: Blocks.ButtonBlockProps;
  CompleteScormButtonBlock: Blocks.CompleteScormButtonBlockProps;
  Section: Blocks.SectionBlockProps;
  CarouselBlock: Blocks.CarouselBlockProps;
  AccordionBlock: Blocks.AccordionBlockProps;
  // Choices blocks
  HeaderChoicesBlock: Blocks.HeaderChoicesBlockProps;
  FooterChoicesBlock: Blocks.FooterChoicesBlockProps;
};

export function config({ projectType }: { projectType: string }): Config<Props> {
  const projectConfig = getProjectConfig(projectType);

  const components = {
    // SCORM & Completion
    CompleteScormButtonBlock: Blocks.CompleteScormButtonBlock,
    // Buttons
    Button: Blocks.ButtonBlock,
    // Containers
    Container: Blocks.ContainerBlock(),

    // Text & Content
    RichText: Blocks.RichTextBlock,
    Card: Blocks.CardBlock,
    Html: Blocks.HtmlBlock,

    // Layout
    Grid: Blocks.GridBlock(),
    Section: Blocks.SectionBlock(),

    // Media & Interactive
    Img: Blocks.ImgBlock,
    CarouselBlock: Blocks.CarouselBlock,
    AccordionBlock: Blocks.AccordionBlock,

    // Dynamic blocks based on project type
    ...projectConfig.components,
  };

  return {
    categories: {
      layout: {
        components: ['Section', 'Container', 'Grid'],
      },
      text: {
        components: ['RichText'],
        title: 'Texto e conteúdo',
      },
      media: {
        components: ['Img', 'Card', 'CarouselBlock', 'AccordionBlock', 'Html'],
        title: 'Mídia e interatividade',
      },
      scorm: {
        components: ['CompleteScormButtonBlock'],
        defaultExpanded: false,
      },
      // Dynamic categories based on project type
      ...projectConfig.categories,
    },
    // Type assertion is required because the spread operator above
    // doesn't guarantee all mandatory keys from 'Props' are present at compile time.
    components: components as Config<Props>['components'],
  };
}

// Simplified type for project-specific configurations
type ProjectConfig = {
  components: Partial<Config<Props>['components']>; // O Partial permite que a função getProjectConfig seja especializada. Ela não precisa conhecer ou reimplementar o sistema inteiro; ela apenas "complementa" o objeto de componentes base com o que for específico para aquele projectType
  categories: Config<Props>['categories'];
};

/**
 * Returns specific blocks and categories for a given project type.
 * Centralized place for project-specific logic (e.g., 'choices', 'quiz').
 */
function getProjectConfig(projectType: string): ProjectConfig {
  const configs: Record<string, ProjectConfig> = {
    choices: {
      components: {
        HeaderChoicesBlock: Blocks.HeaderChoicesBlock,
        FooterChoicesBlock: Blocks.FooterChoicesBlock,
      },
      categories: {
        'Projeto: Choices': {
          components: ['HeaderChoicesBlock', 'FooterChoicesBlock'],
        },
      },
    },
    'other-project': {
      components: {
        HeaderChoicesBlock: Blocks.HeaderChoicesBlock,
        FooterChoicesBlock: Blocks.FooterChoicesBlock,
      },
      categories: {
        'Projeto: Choices': {
          components: ['HeaderChoicesBlock', 'FooterChoicesBlock'],
        },
      },
    },
    // Add new project types here (e.g., 'quiz', 'tutorial')
  };

  return configs[projectType] || { components: {}, categories: {} };
}
