import { SidebarProvider } from '@/components/ui/sidebar';

import { AppSidebar, Footer } from '@/pages/_layouts/app-layout';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="flex min-h-dvh w-full">
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-background flex flex-1 flex-col">
          {/* Dynamic routes content */}
          <Outlet />
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};
export { AppLayout };
