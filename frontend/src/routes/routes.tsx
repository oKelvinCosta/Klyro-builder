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
import { PrivateRoute } from './private-route';

const isDEV = getScormConfig().env === 'DEV';

const routesDEV = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [{ path: '', element: <Auth /> }],
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <MyProjects /> },
      { path: 'group/:groupId', element: <ProjectsByGroup /> },
      { path: 'lixeira', element: <MyTrash /> },
    ],
  },
  {
    path: '/editor/:projectId/:pageId',
    element: (
      <PrivateRoute>
        <BlankLayout />
      </PrivateRoute>
    ),
    children: [{ path: '', element: <PageEditor /> }],
  },
  {
    path: '/preview/:pageId',
    element: (
      <PrivateRoute>
        <PreviewLayout />
      </PrivateRoute>
    ),
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

const routesExportedSCORM = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [{ path: '/', element: <PageProd /> }],
  },
];

export const router = createHashRouter(isDEV ? routesDEV : routesPROD);

export default router;
