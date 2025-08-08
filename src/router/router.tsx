import { createBrowserRouter } from 'react-router-dom';
import { UserListPage } from '../pages/UserListPage';
import { FormPage } from '../pages/FormPage';

export const router = createBrowserRouter([
  { path: '/', element: <UserListPage /> },
  { path: '/new', element: <FormPage mode="create" /> },
  { path: '/edit/:id', element: <FormPage mode="edit" /> },
]);
