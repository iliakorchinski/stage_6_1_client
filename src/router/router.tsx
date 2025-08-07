import { createBrowserRouter } from 'react-router-dom';
import { UserListPage } from '../pages/UserListPage';
import { UserForm } from '../components/Form/Form';

export const router = createBrowserRouter([
  { path: '/', element: <UserListPage /> },
  { path: '/new', element: <UserForm /> },
  { path: '/edit/:id', element: <UserForm /> },
]);
