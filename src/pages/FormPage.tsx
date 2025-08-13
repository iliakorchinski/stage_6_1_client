import { useParams } from 'react-router-dom';
import { Form, type User } from '../components/Form/Form';
import { getUser } from '../service/getUser';
import { useState, useEffect } from 'react';

const CREATE_DEFAULT_VALUES: User = {
  username: '',
  email: null,
  firstName: null,
  lastName: null,
  age: 18,
  role: 'user',
  isActive: true,
  tasks: [],
};

export const FormPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(id ? null : CREATE_DEFAULT_VALUES);

  useEffect(() => {
    const values = async () => {
      if (id) {
        const data: User = await getUser(id);
        setUser(data);
      }
    };
    values();
  }, [id]);
  if (!user) return <p>Loading</p>;

  return <Form defaultValues={user} />;
};
