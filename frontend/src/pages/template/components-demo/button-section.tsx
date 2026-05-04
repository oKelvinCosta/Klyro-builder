import ShowCode from '@/components/template/show-code';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';

type ButtonSize = 'sm' | 'lg';

const variants = [
  { label: 'indigo', variant: 'indigo' },
  { label: 'gray', variant: 'gray' },
  { label: 'lime', variant: 'lime' },
  { label: 'coral', variant: 'red' },
  { label: 'outline', variant: 'outline' },
  { label: 'emoji', variant: 'indigo', isEmoji: true },
];

export default function ButtonsSection() {
  const [size, setSize] = useState<ButtonSize>('sm');



  // 🧠 Dynamic snippet that updates with the selected size
  const snippet = useMemo(() => {
    const sizeProp = size === 'lg' ? ' size="lg"' : '';

    const buttonLines = variants
      .map((v) => {
        const label = v.isEmoji ? '👀 Concluir' : 'Concluir';
        const shownLabel = v.label === 'coral' ? 'coral' : v.label;
        return `
  <div className="flex flex-col items-center gap-2">
    <span className="text-sm text-gray-600">${shownLabel}</span>
    <Button variant="${v.variant}"${sizeProp}>${label}</Button>
  </div>`;
      })
      .join('');

    return `
<div className="flex flex-wrap gap-4">
${buttonLines}
</div>
`.trim();
  }, [size]);

  return (
    <section id="buttons" className="border-b p-4">
      {/* ShowCode dynamic */}
      <div className="mb-2 flex justify-end">
        <ShowCode title="Buttons • snippet" code={snippet} />
      </div>

      {/* Size controls */}
      <div className="mb-6 flex gap-3">
        <Button variant={size === 'sm' ? 'indigo' : 'outline'} onClick={() => setSize('sm')}>
          Small (SM)
        </Button>
        <Button variant={size === 'lg' ? 'indigo' : 'outline'} onClick={() => setSize('lg')}>
          Large (LG)
        </Button>
      </div>

      {/* Fixed-height preview area */}
      <div className="flex min-h-[14rem] items-center justify-center">
        <div className="flex flex-wrap justify-center gap-6">
          {variants.map((v) => (
            <div key={v.label} className="flex flex-col items-center gap-2">
              <span className="text-sm capitalize text-gray-600">
                {v.label === 'coral' ? 'coral' : v.label}
              </span>
              <Button
                variant={v.variant as 'indigo' | 'gray' | 'lime' | 'red' | 'outline'}
                size={size}
              >
                {v.isEmoji ? '👀 Concluir' : 'Concluir'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
