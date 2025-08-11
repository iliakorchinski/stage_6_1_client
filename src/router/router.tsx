import { createBrowserRouter } from 'react-router-dom';
import { UsersList } from '../components/Users/UsersList';
import { FormPage } from '../pages/FormPage';

export const router = createBrowserRouter([
  { path: '/', element: <UsersList /> },
  { path: '/new', element: <FormPage /> },
  { path: '/edit/:id', element: <FormPage /> },
]);
