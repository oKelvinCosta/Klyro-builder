import { ImportIcon, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Header({ breadcrumb = false, title }: { breadcrumb?: boolean; title?: string }) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const { mutate: createProject, isPending } = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/projects`, {});
      return response.data;
    },
    onSuccess: (data) => {
      // 1. Invalida listas que precisam atualizar
      queryClient.invalidateQueries({ queryKey: ['ungroupedPages'] });

      // 2. Popula o cache do item individual (evita GET desnecessário)
      queryClient.setQueryData(['Project', data.project._id], {
        project: data.project,
        firstPage: data.page,
      });
      navigate(`/editor/${data.project._id}/${data.page._id}`);
    },
    onError: () => {
      setIsCreating(false);
    },
  });

  const handleCreateProject = () => {
    setIsCreating(true);
    createProject();
  };
  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-[60px] items-center justify-between gap-6 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="[&_svg]:!size-5" />
          <Separator orientation="vertical" className="hidden !h-4 sm:block" />
          {breadcrumb && (
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList className="flex">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Início</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  <BreadcrumbPage>{title || 'Grupo'}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button variant={'muted'} className="flex items-center gap-2" disabled>
            <ImportIcon className="" /> Importar
          </Button>
          <Button
            variant={'neon'}
            className="flex items-center gap-2"
            onClick={() => handleCreateProject()}
            disabled={isCreating || isPending}
          >
            <Plus className="" /> {isCreating ? 'Criando...' : 'Projeto'}
          </Button>
        </div>
      </div>
    </header>
  );
}
