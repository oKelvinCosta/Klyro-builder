import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  // const [userId, setUserId] = useState('69c9a51d260548585aa1fad8');

  const handleCreateProject = () => {
    // console.log('Create project');
  };
  return (
    <header className="bg-card sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-[80px] items-center justify-between gap-6 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="[&_svg]:!size-5" />
          <Separator orientation="vertical" className="hidden !h-4 sm:block" />
          {/* <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="flex">
              <BreadcrumbItem>
                <BreadcrumbPage>App</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant={'indigo'}
            className="flex items-center gap-2"
            onClick={() => handleCreateProject()}
          >
            <Plus className="-mt-1" /> Projeto
          </Button>
        </div>
      </div>
    </header>
  );
}
