import PreviewLayout from '@/pages/_layouts/editor/preview-layout';

import { getScormConfig } from '@/config/course-config';
import { PageAuth } from '@/pages/app/auth/page-auth';
import { PageMyProjects } from '@/pages/app/my-projects';
import { PageProjectsByGroup } from '@/pages/app/projects-by-group/';
import { PageMyTrash } from '@/pages/app/trash';
import { PageEditor } from '@/pages/editor/page-editor';
import { PagePreview } from '@/pages/editor/page-preview';
import { createHashRouter } from 'react-router-dom';
import { AppLayout } from '../pages/_layouts/app-layout/app-layout';
import { BlankLayout } from '../pages/_layouts/blank-layout';
import { PageScorm } from '../pages/editor/page-scorm';
import { PrivateRoute } from './private-route';

const isDEV = getScormConfig().env === 'DEV';

const routesDEV = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [{ path: '', element: <PageAuth /> }],
  },
  {
    path: '/app',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '', element: <PageMyProjects /> },
      { path: 'group/:groupId', element: <PageProjectsByGroup /> },
      { path: 'trash', element: <PageMyTrash /> },
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
    children: [{ path: '/', element: <PageScorm /> }],
  },
];

const routesExportedSCORM = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [{ path: '/', element: <PageScorm /> }],
  },
];

export const router = createHashRouter(isDEV ? routesDEV : routesPROD);

export default router;
