import { api } from '@/lib/axios';
import { Header, ListGroups } from '@/pages/app/my-projects';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ListPages } from '../components/list-pages';

export function MyProjects() {
  const [userId] = useState('69c9a51d260548585aa1fad8');

  // Get ungrouped pages of user
  const { data: pagesData, isLoading: isLoadingPages } = useQuery({
    queryKey: ['ungroupedPages', userId],
    queryFn: () => api.get(`/pages/ungrouped?userId=${userId}`).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 10 minutos cache
    gcTime: 4 * 60 * 1000, // 15 minutos cache
  });
  return (
    <>
      <Header />
      <div className="mx-auto size-full flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-12 lg:gap-8 2xl:grid-cols-12">
          {/* Pages */}
          <ListPages pagesData={pagesData || []} isLoadingPages={isLoadingPages} />

          {/* Groups */}
          <ListGroups />
        </div>
      </div>
    </>
  );
}
