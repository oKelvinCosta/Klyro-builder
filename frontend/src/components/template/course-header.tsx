import { type DividerType } from '@/components/layout/divider';
import Section from '@/components/layout/section';
import { courseConfig } from '@/config/course-config';

interface CourseHeaderProps {
  grade: string;
  subject: string;
  gradient?: 'gradient01' | 'gradient02';
  children?: string | React.ReactNode;
  backgroundSrc?: string;

  /** 🆕 Optional divider customization */
  dividerType?: DividerType;
  dividerColor?: string;
}

const GRADIENTS = {
  gradient01: 'bg-gradient-to-r from-indigo-600 from-30% to-azure-400 to-100%',
  gradient02: 'bg-gradient-to-r from-coral-400 from-10% to-indigo-600 to-100%',
};

export default function CourseHeader({
  grade,
  subject,
  gradient = 'gradient01',
  children,
  backgroundSrc = './imgs/core/hero.png', // ✅ FIXED
  dividerType = 'type03',
  dividerColor = 'text-white',
}: CourseHeaderProps) {
  return (
    <Section
      backgroundSrc={backgroundSrc}
      contentClassName="!py-0 !pb-10 container"
      dividerBottom={{ type: dividerType, className: dividerColor }}
    >
      <div className="flex h-[80vh] w-full flex-col bg-cover bg-center text-white">
        {/* Pill */}
        <div className="mt-4 flex w-full items-center justify-center">
          <div
            className={`relative flex h-10 w-full max-w-[18rem] items-center justify-center overflow-hidden rounded-full px-4 text-xs font-bold text-white sm:h-12 sm:max-w-[50rem] sm:justify-between sm:px-6 sm:text-sm ${GRADIENTS[gradient]}`}
          >
            {/* Background Mask SVG */}
            <img
              src="./imgs/core/mask-group.svg" // ✅ FIXED
              alt="Mask Group"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />

            {/* Logo */}
            <img
              src="./imgs/core/choices-logo.svg" // ✅ FIXED
              alt="Logo"
              className="z-10 h-4 w-auto object-contain sm:h-4"
            />

            {/* Grade and Subject */}
            <span className="z-10 hidden sm:inline">
              {grade} | {subject}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="flex h-full items-center justify-center">
          <h1 className="mx-auto mt-8 max-w-3xl px-4 text-center text-2xl font-bold leading-snug sm:text-3xl md:text-4xl lg:text-5xl">
            {children ? children : courseConfig.title}
          </h1>
        </div>
      </div>
    </Section>
  );
}
