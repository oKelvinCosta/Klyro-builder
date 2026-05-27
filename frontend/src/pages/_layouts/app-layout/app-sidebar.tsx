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
import { BellIcon, HouseIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AppSidebar() {
  const mockUser = {
    name: 'Kelvin costa',
    email: 'okelvincosta@gmail.com',

    // avatar: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=oKelvin',
    avatar: 'https://avatars.githubusercontent.com/u/28162385?v=4&size=64',
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
                    <Link to={'/'}>
                      <HouseIcon />
                      <span>Início</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <BellIcon />
                      Notificações
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <UsersIcon />
                      <span>Compartilhados comigo</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={'/lixeira'}>
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
                  <Link to={'/'}>
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
