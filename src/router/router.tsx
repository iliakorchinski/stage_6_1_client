import { createBrowserRouter } from 'react-router-dom';
import { UserListPage } from '../pages/UserListPage';
import { FormPage } from '../pages/FormPage';

export const router = createBrowserRouter([
  { path: '/', element: <UserListPage /> },
  { path: '/new', element: <FormPage /> },
  { path: '/edit/:id', element: <FormPage /> },
]);
