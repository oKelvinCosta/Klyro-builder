import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import React from 'react';

interface AccordionItemData {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  className?: string;
  forcedOpen?: boolean;
}

export default function AccordionContained({
  items,
  className,
  forcedOpen = false,
  ...props
}: AccordionProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground w-full overflow-hidden border shadow-sm',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {forcedOpen ? (
        <Accordion type="multiple" className="w-full" value={items.map((_, i) => `item-${i}`)}>
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(index !== 0 && 'border-t', 'w-full')}
            >
              <AccordionTrigger className="px-4 py-3 text-lg">{item.title}</AccordionTrigger>
              <AccordionContent className="px-4 pb-2 pt-0" forceMount>
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={cn(index !== 0 && 'border-t', 'w-full')}
            >
              <AccordionTrigger className="px-4 py-3 text-lg">{item.title}</AccordionTrigger>
              <AccordionContent className="px-4 pb-2 pt-0">{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
