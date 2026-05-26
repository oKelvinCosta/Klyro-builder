import { api } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Header } from '../components/header';
import { ListProjects } from '../components/list-projects';

export function MyTrash() {
  const [userId] = useState('69c9a51d260548585aa1fad8'); //kelvin

  // Get pages of user
  const { data: projectsData, isLoading: isLoadingPages } = useQuery({
    queryKey: ['deletedProjects', userId],
    queryFn: () => api.get(`/projects/trash?userId=${userId}`).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    gcTime: 4 * 60 * 1000,
  });

  return (
    <>
      <Header />
      <div className="mx-auto size-full flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-12 lg:gap-8 2xl:grid-cols-12">
          {/* Pages */}
          <ListProjects
            projectsData={projectsData || []}
            isLoadingPages={isLoadingPages}
            variant="trash"
          />
        </div>
      </div>
    </>
  );
}
