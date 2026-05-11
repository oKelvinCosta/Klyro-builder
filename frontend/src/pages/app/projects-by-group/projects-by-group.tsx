import { api } from '@/lib/axios';
import { ListPages } from '@/pages/app/components/list-pages';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Header } from '../components/header';

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
      <Header breadcrumb />
      <div className="mx-auto size-full flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-12 lg:gap-8 2xl:grid-cols-12">
          {/* Pages */}
          <ListPages pagesData={pagesData || []} isLoadingPages={isLoadingPages} />
        </div>
      </div>
    </>
  );
}
