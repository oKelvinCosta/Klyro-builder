import Img from '@/components/img';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/date';
import { CopyIcon, EllipsisVerticalIcon, FolderInputIcon, TrashIcon, UserPlus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useNavigate } from 'react-router-dom';

interface pagesDataProps {
  _id: string;
  title: string;
  slug: string;
  cover: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  groupCardId?: string;
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
            className="group cursor-pointer md:col-span-4 2xl:col-span-3"
            onClick={() => handleOpenProject(page._id)}
          >
            <Card className="overflow-hidden p-0 transition-all duration-200 group-hover:shadow-lg">
              <CardHeader className="relative">
                <Img src={page.cover} className="aspect-video !rounded-none" alt="" />

                <DropdownMenuIcons />
              </CardHeader>

              <CardFooter className="p-4">
                <div className="flex flex-col gap-0">
                  <span className="!text-xs font-medium">{page.title || 'Sem título'}</span>
                  <span className="text-muted-foreground !text-xs">
                    Editado há {formatRelativeTime(page.updatedAt)}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))
      )}
    </>
  );
}

export function DropdownMenuIcons() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            data-sidebar="trigger"
            variant="muted"
            size="icon"
            className="group-hover:bg-space-500/40 absolute right-2 top-0 h-8 w-8 !text-white"
          >
            <EllipsisVerticalIcon />
            <span className="sr-only">Toggle página menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <CopyIcon />
            Duplicar
          </DropdownMenuItem>

          {/* Mover */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderInputIcon />
              Mover
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Calendly</DropdownMenuItem>
                      <DropdownMenuItem>Slack</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Webhook</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <UserPlus />
            Compartilhar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <TrashIcon />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
