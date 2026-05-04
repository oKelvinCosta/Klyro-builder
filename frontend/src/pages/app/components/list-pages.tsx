import Img from '@/components/img';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/date';

import { useNavigate } from 'react-router-dom';

interface pagesDataProps {
  _id: string;
  title: string;
  slug: string;
  cover: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  groupId?: string;
}

interface ListPagesComponentProps {
  pagesData: pagesDataProps[];
  isLoadingPages: boolean;
}

export function ListPages({ pagesData, isLoadingPages }: ListPagesComponentProps) {
  const navigate = useNavigate();

  const handleOpenProject = (pageId: string) => {
    // console.log('Open project', pageId);
    navigate(`/editor/${pageId}`);
  };

  return (
    <>
      {isLoadingPages ? (
        <div className="md:col-span-4 2xl:col-span-3">
          <Card className="overflow-hidden p-0">
            <CardHeader>
              <Skeleton className="col-span-2 aspect-video w-full !rounded-none" />
            </CardHeader>

            <CardFooter className="p-4">
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-[80%]" /> {/* Agora funciona */}
                <Skeleton className="h-3 w-[100px]" />
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        pagesData?.map((page: pagesDataProps) => (
          <div
            key={page._id}
            className="cursor-pointer md:col-span-4 2xl:col-span-3"
            onClick={() => handleOpenProject(page._id)}
          >
            <Card className="overflow-hidden p-0">
              <CardHeader>
                <Img src={page.cover} className="aspect-video !rounded-none" alt="" />
              </CardHeader>

              <CardFooter className="p-4">
                <div className="flex flex-col gap-0">
                  <span className="!text-sm font-medium">{page.title || 'Sem título'}</span>
                  <span className="!text-xs">Editado há {formatRelativeTime(page.updatedAt)}</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))
      )}
    </>
  );
}
