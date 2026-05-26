import Img from '@/components/img';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatRelativeTime } from '@/lib/date';
import {
  CheckIcon,
  CopyIcon,
  EllipsisVerticalIcon,
  FolderInputIcon,
  FolderMinusIcon,
  RotateCcwIcon,
  TrashIcon,
  UserPlus,
} from 'lucide-react';

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

import { api } from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectsDataProps {
  _id: string;
  title: string;
  slug: string;
  version: string;
  cover: string;
  updatedAt: string;
  createdAt: string;
  userId: string;
  groupId: null | string;
  deletedAt: null | string;
  firstPageId: string;
}

interface ListProjectsComponentProps {
  projectsData: ProjectsDataProps[];
  isLoadingPages: boolean;
  variant?: 'default' | 'trash';
}

export function ListProjects({
  projectsData,
  isLoadingPages,
  variant = 'default',
}: ListProjectsComponentProps) {
  const navigate = useNavigate();

  const handleOpenProject = (projectId: string, pageId: string) => {
    if (variant === 'trash') return;
    navigate(`/editor/${projectId}/${pageId}`);
  };

  // console.log('ListProjects', projectsData);

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
        projectsData?.map((page: ProjectsDataProps) => (
          <div
            key={page._id}
            className={`group md:col-span-4 2xl:col-span-3 ${variant !== 'trash' ? 'cursor-pointer' : 'cursor-default'}`}
            onClick={() => handleOpenProject(page._id, page.firstPageId)}
          >
            <Card className="overflow-hidden p-0 transition-all duration-200 group-hover:shadow-lg">
              <CardHeader className="relative">
                {/* <Img src={page.cover} className="aspect-video !rounded-none" alt="" /> */}

                {/* Provisory */}
                <Img src={page.cover} className="aspect-video !rounded-none opacity-0" alt="" />
                <Img
                  src={page.cover}
                  className="absolute left-[50%] top-[50%] max-w-[80px] translate-x-[-50%] translate-y-[-50%] !rounded-none"
                  alt=""
                />
                {variant === 'trash' ? (
                  <DropdownMenuTrashIcons projectId={page._id} userId={page.userId} />
                ) : (
                  <DropdownMenuIcons
                    projectId={page._id}
                    userId={page.userId}
                    groupId={page.groupId}
                  />
                )}
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

export function DropdownMenuIcons({
  projectId,
  userId,
  groupId,
}: {
  projectId: string;
  userId: string;
  groupId: string | null;
}) {
  const queryClient = useQueryClient();
  const [newGroupName, setNewGroupName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: groups = [] } = useQuery<{ _id: string; name: string }[]>({
    queryKey: ['groups', userId],
    queryFn: () => api.get(`/groups?userId=${userId}`).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
  });

  const { mutate: duplicateProject } = useMutation({
    mutationFn: () => api.post(`/projects/${projectId}/duplicate`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ungroupedPages', userId] });
      if (groupId) queryClient.invalidateQueries({ queryKey: ['projectsByGroup', groupId] });
    },
  });

  const { mutate: trashProject } = useMutation({
    mutationFn: () => api.patch(`/projects/${projectId}/trash`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ungroupedPages', userId] });
      if (groupId) queryClient.invalidateQueries({ queryKey: ['projectsByGroup', groupId] });
    },
  });

  // Move or to a group or remove
  const { mutate: moveToGroup } = useMutation({
    mutationFn: (targetGroupId: string | null) =>
      api.patch(`/projects/${projectId}/group`, { groupId: targetGroupId }).then((res) => res.data),
    onSuccess: (_data, targetGroupId) => {
      queryClient.invalidateQueries({ queryKey: ['ungroupedPages', userId] });
      queryClient.invalidateQueries({ queryKey: ['groupsWithProjects', userId] });
      if (targetGroupId) {
        queryClient.invalidateQueries({ queryKey: ['projectsByGroup', targetGroupId] });
        queryClient.invalidateQueries({ queryKey: ['groupPages', targetGroupId] });
      }
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: ['projectsByGroup', groupId] });
        queryClient.invalidateQueries({ queryKey: ['groupPages', groupId] });
      }
    },
  });

  const { mutate: createGroupAndMove } = useMutation({
    mutationFn: () =>
      api
        .post('/groups', { name: newGroupName.trim(), userId })
        .then((res) => res.data)
        .then((group) =>
          api.patch(`/projects/${projectId}/group`, { groupId: group._id }).then(() => group)
        ),
    onSuccess: (group: { _id: string; name: string }) => {
      queryClient.invalidateQueries({ queryKey: ['groups', userId] });
      queryClient.invalidateQueries({ queryKey: ['ungroupedPages', userId] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGroup', group._id] });
      queryClient.invalidateQueries({ queryKey: ['groupsWithProjects', userId] });
      setNewGroupName('');
    },
  });

  const handleCreateGroup = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!newGroupName.trim()) return;
    createGroupAndMove();
  };

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
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              duplicateProject();
            }}
          >
            <CopyIcon />
            Duplicar
          </DropdownMenuItem>

          {/* Mover */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
              <FolderInputIcon />
              Mover
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
                {groupId && (
                  <>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToGroup(null);
                      }}
                    >
                      <FolderMinusIcon />
                      Desagrupar
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group._id}
                    disabled={group._id === groupId}
                    onClick={(e) => {
                      e.stopPropagation();
                      moveToGroup(group._id);
                    }}
                  >
                    {group.name}
                  </DropdownMenuItem>
                ))}

                {groups.length > 0 && <DropdownMenuSeparator />}

                {/* Create new group */}
                <div
                  className="flex items-center gap-1 px-2 py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    ref={inputRef}
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateGroup(e);
                    }}
                    placeholder="Novo grupo..."
                    className="bg-background h-7 w-full rounded border px-2 text-xs outline-none focus:ring-1"
                  />
                  <Button
                    size="icon"
                    variant="muted"
                    className="h-7 w-7 shrink-0"
                    disabled={!newGroupName.trim()}
                    onClick={handleCreateGroup}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem>
            <UserPlus />
            Compartilhar
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              trashProject();
            }}
          >
            <TrashIcon />
            Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export function DropdownMenuTrashIcons({
  projectId,
  userId,
}: {
  projectId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();

  const { mutate: restoreProject } = useMutation({
    mutationFn: () => api.patch(`/projects/${projectId}/restore`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deletedProjects', userId] });
    },
  });

  return (
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
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            restoreProject();
          }}
        >
          <RotateCcwIcon />
          Restaurar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
