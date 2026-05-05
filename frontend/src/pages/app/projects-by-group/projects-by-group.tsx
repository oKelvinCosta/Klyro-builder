import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { api } from '@/lib/axios';
import { ListPages } from '@/pages/app/components/list-pages';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

export function ProjectsByGroup() {
  const { groupId } = useParams();

  // Get pages of user
  const { data: pagesData, isLoading: isLoadingPages } = useQuery({
    queryKey: ['groupPages', groupId],
    queryFn: () => api.get(`/pages/group/${groupId}`).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 10 minutos cache
    gcTime: 4 * 60 * 1000, // 15 minutos cache
  });

  return (
    <>
      <header className="bg-card sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-[80px] items-center justify-between gap-6 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="[&_svg]:!size-5" />
            <Separator orientation="vertical" className="hidden !h-4 sm:block" />
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList className="flex">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">App</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage>Grupo</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-1.5">
            {/* <Button
              variant={'indigo'}
              className="flex items-center gap-2"
              onClick={() => handleCreateProject()}
            >
              <Plus className="-mt-1" /> Projeto
            </Button> */}
          </div>
        </div>
      </header>
      <div className="mx-auto size-full flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-12 lg:gap-8 2xl:grid-cols-12">
          {/* Pages */}
          <ListPages pagesData={pagesData || []} isLoadingPages={isLoadingPages} />
        </div>
      </div>
    </>
  );
}
