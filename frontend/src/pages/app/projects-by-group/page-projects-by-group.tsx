import { api } from '@/lib/axios';
import { ListProjects } from '@/pages/app/components/list-projects';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Header } from '../components/header';

export function PageProjectsByGroup() {
  const { groupId } = useParams();

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['groupPages', groupId],
    queryFn: () => api.get(`/projects/group/${groupId}`).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    gcTime: 4 * 60 * 1000,
  });

  const { data: groupData } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => api.get(`/groups/${groupId}`).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <Header breadcrumb title={groupData?.name} />
      <div className="mx-auto size-full flex-1 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-8 lg:grid-cols-12 lg:gap-8 2xl:grid-cols-12">
          {/* Projects */}
          <ListProjects projectsData={projectsData || []} isLoadingPages={isLoadingProjects} />
        </div>
      </div>
    </>
  );
}
