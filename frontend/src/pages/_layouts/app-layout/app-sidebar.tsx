import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NavUser } from '@/editor/components/nav-user';
import { useAuthUser } from '@/hooks/use-auth-user';
import { BellIcon, HouseIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppSidebar() {
  const { userMongo } = useAuthUser();
  const mockUser = {
    name: userMongo?.name,
    email: userMongo?.email,
    avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${userMongo?.name}`,
  };
  return (
    <Sidebar>
      <SidebarContent>
        {/* Pages */}
        <SidebarGroup className="dark:text-space-300">
          <SidebarGroupContent>
            <SidebarMenu>
              {/* User */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavUser user={mockUser} />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              <SidebarGroup>
                {/* Menu */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={'/app'}>
                      <HouseIcon />
                      <span>Início</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={'/app'}>
                      <BellIcon />
                      Notificações
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={'/app'}>
                      <UsersIcon />
                      <span>Compartilhados comigo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={'/app/lixeira'}>
                      <TrashIcon />
                      <span>Lixeira</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroup>
            </SidebarMenu>

            <SidebarSeparator />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* Logo */}
        <SidebarGroup className="flex justify-center md:h-[70px]">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-2.5!">
                  <Link to={'/app'}>
                    <span className="text-space-500 dark:text-primary title-font m-0 text-2xl font-bold">
                      Klyro
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
