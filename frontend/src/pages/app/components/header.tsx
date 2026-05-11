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
import { Link } from 'react-router-dom';

export function Header({ breadcrumb = false }) {
  // const [userId, setUserId] = useState('69c9a51d260548585aa1fad8');

  const handleCreateProject = () => {
    // console.log('Create project');
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
                  <BreadcrumbPage>Grupo</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={'muted'}
            className="flex items-center gap-2"
            onClick={() => handleCreateProject()}
          >
            <ImportIcon className="" /> Importar
          </Button>
          <Button
            variant={'neon'}
            className="flex items-center gap-2"
            onClick={() => handleCreateProject()}
          >
            <Plus className="" /> Projeto
          </Button>
        </div>
      </div>
    </header>
  );
}
