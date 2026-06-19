import Img from '@/components/img';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVerticalIcon, TrashIcon } from 'lucide-react';

export function ListGroups() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [groupToDelete, setGroupToDelete] = useState<{
    _id: string;
    name: string;
    projectsLength: number;
  } | null>(null);

  const handleOpenGroup = (groupId: string) => {
    console.info('Open group', groupId);
    navigate(`/group/${groupId}`);
  };

  const useGroupsWithProjects = () => {
    return useQuery({
      queryKey: ['groupsWithProjects'],
      queryFn: () => api.get(`/groups/with-projects`).then((res) => res.data),
      staleTime: 5 * 60 * 1000,
      gcTime: 8 * 60 * 1000,
    });
  };

  const { data: groupsWithProjects, isLoading: isLoadingGroupsWithProjects } =
    useGroupsWithProjects();

  // Delete Group Mutation
  const { mutate: deleteGroupMutation } = useMutation({
    mutationFn: (groupId: string) => api.delete(`/groups/${groupId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['groupsWithProjects'] });
      queryClient.invalidateQueries({ queryKey: ['deletedProjects'] });
      setGroupToDelete(null);
    },
  });

  return (
    <>
      {isLoadingGroupsWithProjects ? (
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
        groupsWithProjects?.map(
          (
            group: any,
            index: number // eslint-disable-line @typescript-eslint/no-explicit-any
          ) => (
            <div
              key={index}
              className="group relative cursor-pointer md:col-span-4 2xl:col-span-3"
              onClick={() => handleOpenGroup(group._id)}
            >
              <Card className="relative h-full overflow-hidden p-0 transition-all duration-200 hover:shadow-lg">
                {/* Dropdown Menu Actions */}
                <div className="absolute right-2 top-2 z-10" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="muted"
                        size="icon"
                        className="group-hover:bg-space-500/40 absolute right-2 top-0 h-8 w-8 !text-white"
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                        <span className="sr-only">Menu do grupo</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToDelete({
                            _id: group._id,
                            name: group.name,
                            projectsLength: group.projects?.length || 0,
                          });
                        }}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardContent className="grid grid-cols-4 gap-3 p-4">
                  {group.projects?.slice(0, 3).map(
                    (
                      page: any,
                      pageIndex: number // eslint-disable-line @typescript-eslint/no-explicit-any
                    ) => (
                      <Img
                        key={pageIndex}
                        src={page.cover || './imgs/core/placeholder.webp'}
                        className="col-span-2 aspect-video rounded-2xl"
                        alt=""
                      />
                    )
                  )}
                  {
                    // Fill empty slots to maintain grid structure
                    Array.from({
                      length: group.projects?.length < 4 ? 4 - group.projects?.length : 0,
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
                    <span className="!text-xs font-medium">{group.name || 'Sem nome'}</span>
                    <span className="text-muted-foreground !text-xs">
                      {group.projects?.length || 0} projetos
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )
        )
      )}

      {/* Dialog para confirmação de deleção */}
      <Dialog
        open={!!groupToDelete}
        onOpenChange={(open) => {
          if (!open) setGroupToDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-left">
            <DialogTitle>Deletar Grupo</DialogTitle>
            <DialogDescription className="w-full space-y-3 pt-2">
              <span className="text-foreground block text-sm">
                Tem certeza que deseja deletar o grupo{' '}
                <strong className="text-secondary font-semibold">{groupToDelete?.name}</strong>?
              </span>
              {groupToDelete && groupToDelete.projectsLength > 0 && (
                <span className="border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20 block rounded-lg border p-3">
                  <strong className="block text-sm font-semibold">Atenção!</strong>
                  <span className="mt-1 block text-xs leading-relaxed">
                    Este grupo possui <strong>{groupToDelete.projectsLength}</strong> projeto(s). Ao
                    deletar o grupo, todos os projetos dentro dele serão movidos para a lixeira.
                  </span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-1 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setGroupToDelete(null)}>
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (groupToDelete) {
                  deleteGroupMutation(groupToDelete._id);
                }
              }}
            >
              Deletar Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
