import { useParams } from 'react-router-dom';
import { Form, type User } from '../components/Form/Form';
import { getUser } from '../service/getUser';

export const FormPage = () => {
  const { id } = useParams();

  const defaultValues: Partial<User> = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    age: 18,
    role: 'user',
    isActive: true,
    tasks: [],
  };

  const values = async () => {
    if (id) {
      return await getUser(id);
    } else {
      return defaultValues;
    }
  };

  return <Form defaultValues={values} />;
};
