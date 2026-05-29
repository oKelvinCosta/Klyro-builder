import { api } from '@/lib/axios';
// import { ListGroups } from '@/pages/app/my-projects';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Header } from '../components/header';
import { ListProjects } from '../components/list-projects';
import { ListGroups } from './list-groups';

export function MyProjects() {
  const [userId] = useState('69c9a51d260548585aa1fad8');

  // Get ungrouped pages of user
  const { data: projectsData, isLoading: isLoadingPages } = useQuery({
    queryKey: ['ungroupedPages', userId],
    queryFn: () => api.get(`/projects/ungrouped?userId=${userId}`).then((res) => res.data),
    staleTime: 0,
    gcTime: 4 * 60 * 1000,
  });
  // console.log('my-projects', projectsData);
  return (
    <>
      <Header />
      <div className="mx-auto size-full flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-12 lg:gap-8 2xl:grid-cols-12">
          {/* Pages */}
          <ListProjects projectsData={projectsData || []} isLoadingPages={isLoadingPages} />

          {/* Groups */}
          <ListGroups />
        </div>
      </div>
    </>
  );
}
