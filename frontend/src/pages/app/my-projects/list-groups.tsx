import Img from '@/components/img';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/axios';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ListGroups() {
  const navigate = useNavigate();
  const handleOpenGroup = (groupId: string) => {
    console.info('Open group', groupId);
    navigate(`/app/group/${groupId}`);
  };

  const [userId] = useState('69c9a51d260548585aa1fad8');

  // console.log('pagesData', pagesData);

  const useGroupsWithPages = () => {
    return useQuery({
      queryKey: ['groupsWithPages', userId],
      queryFn: () => api.get(`/groups/with-pages?userId=${userId}`).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
      gcTime: 8 * 60 * 1000,
    });
  };

  const { data: groupsWithPages, isLoading: isLoadingGroupsWithPages } = useGroupsWithPages();

  return (
    <>
      {isLoadingGroupsWithPages ? (
        <div className="cursor-pointer md:col-span-4 2xl:col-span-3">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid grid-cols-4 gap-3 p-4">
              <Skeleton className="col-span-2 aspect-video w-full rounded-2xl" />
              <Skeleton className="col-span-2 aspect-video w-full rounded-2xl" />
              <Skeleton className="col-span-2 aspect-video w-full rounded-2xl" />
              <Card className="col-span-2 aspect-video rounded-2xl" />
            </CardContent>

            <CardFooter className="p-4 pt-0">
              <Skeleton className="block h-4 w-full" />
              <Skeleton className="block h-4 w-full" />
            </CardFooter>
          </Card>
        </div>
      ) : (
        groupsWithPages?.map((group: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
          <div
            key={index}
            className="cursor-pointer md:col-span-4 2xl:col-span-3"
            onClick={() => handleOpenGroup(group._id)}
          >
            <Card className="overflow-hidden p-0">
              <CardContent className="grid grid-cols-4 gap-3 p-4">
                {group.pages?.slice(0, 3).map((page: any, pageIndex: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <Img
                    key={pageIndex}
                    src={page.cover || './imgs/core/placeholder.webp'}
                    className="col-span-2 aspect-video rounded-2xl"
                    alt=""
                  />
                ))}
                {
                  // Fill empty slots to maintain grid structure
                  Array.from({
                    length: group.pages?.length < 4 ? 4 - group.pages?.length : 0,
                  }).map((_, emptyIndex) => (
                    <Card
                      key={`empty-${emptyIndex}`}
                      className="col-span-2 aspect-video rounded-2xl"
                    />
                  ))
                }
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <div className="flex flex-col gap-0">
                  <span className="!text-sm font-medium">{group.name || 'Sem nome'}</span>
                  <span className="!text-xs">{group.pages?.length || 0} projetos</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))
      )}
    </>
  );
}
