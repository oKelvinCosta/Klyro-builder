import PreviewLayout from '@/pages/_layouts/preview-layout';

import { getScormConfig } from '@/config/course-config';
import Auth from '@/pages/app/auth/auth';
import { MyProjects } from '@/pages/app/my-projects';
import { ProjectsByGroup } from '@/pages/app/projects-by-group/';
import { MyTrash } from '@/pages/app/trash';
import { PageEditor } from '@/pages/puck/page-editor';
import { PagePreview } from '@/pages/puck/page-preview';
import { createHashRouter } from 'react-router-dom';
import { AppLayout } from '../pages/_layouts/app-layout/app-layout';
import BlankLayout from '../pages/_layouts/blank-layout';
import { PageProd } from '../pages/puck/page-prod';

const isDEV = getScormConfig().env === 'DEV';

const routesDEV = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '', element: <MyProjects /> },
      { path: 'group/:groupId', element: <ProjectsByGroup /> },
      { path: 'lixeira', element: <MyTrash /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [{ path: '', element: <Auth /> }],
  },

  {
    path: '/editor/:projectId/:pageId',
    element: <BlankLayout />,
    children: [{ path: '', element: <PageEditor /> }],
  },
  {
    path: '/preview/:pageId',
    element: <PreviewLayout />,
    children: [{ path: '', element: <PagePreview /> }],
  },
];

const routesPROD = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [{ path: '/', element: <PageProd /> }],
  },
];

export const router = createHashRouter(isDEV ? routesDEV : routesPROD);

export default router;
