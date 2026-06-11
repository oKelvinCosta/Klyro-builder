import Img from '@/components/img';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { useEffect, useState, type ReactNode } from 'react';

interface CarouselItemData {
  imgSrc: string;
  title?: string | ReactNode;
  content?: string | ReactNode;
}

interface CarouselCardProps {
  items: CarouselItemData[];
  layout?: '1:1' | '1:2' | '2:1';
}

export default function CarouselCard({ items, layout = '1:2', ...props }: CarouselCardProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const layoutMap = {
    '1:1': {
      grid: 'grid-cols-1 md:grid-cols-2',
      img: 'col-span-1',
      content: 'col-span-1',
    },
    '1:2': {
      grid: 'grid-cols-1 md:grid-cols-3',
      img: 'col-span-1 md:col-span-1',
      content: 'col-span-1 md:col-span-2',
    },
    '2:1': {
      grid: 'grid-cols-1 md:grid-cols-3',
      img: 'col-span-1 md:col-span-2',
      content: 'col-span-1 md:col-span-1',
    },
  };

  const { grid, img: colsImg, content: colsContent } = layoutMap[layout];

  // Sync pagination
  useEffect(() => {
    if (!api) return;

    api.reInit();

    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    update();

    api.on('select', update);
    api.on('reInit', update);

    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api, items.length]);

  return (
    <div>
      <Carousel setApi={setApi} className="w-full" {...props}>
        <CarouselContent className="items-center">
          {items.map((item, key) => (
            <CarouselItem key={key}>
              <Card>
                <CardContent className="p-0">
                  <div className={`grid gap-6 ${grid} items-center`}>
                    {/* IMAGE */}
                    <Img
                      src={item.imgSrc}
                      className={`aspect-video h-full w-full rounded-lg object-cover ${colsImg}`}
                    />

                    {/* CONTENT BLOCK */}
                    <div className={`${colsContent}`}>
                      <div className="flex flex-col justify-center">
                        {/* TITLE */}
                        {item.title &&
                          (layout === '1:1' ? (
                            <h4 className="text-primary w-full leading-tight">{item.title}</h4>
                          ) : (
                            <p className="text-primary !mb-4 w-full font-bold leading-tight">
                              {item.title}
                            </p>
                          ))}

                        {/* string | ReactNode */}
                        {item.content && (
                          <div className="text-card-foreground text-base leading-relaxed">
                            {item.content}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-auto right-12 top-[calc(100%+1rem)] translate-y-0" />
        <CarouselNext className="right-2 top-[calc(100%+1rem)] translate-y-0" />
      </Carousel>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-start gap-2 pb-6">
        {Array.from({ length: count }).map((_, index) => {
          const isActive = current === index + 1;
          return (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'bg-card text-card-foreground h-3 w-3 rounded-full border transition-colors duration-300',
                isActive
                  ? 'border-border hover:bg-space-200 border-2'
                  : 'border-border bg-card/60 hover:bg-card'
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
