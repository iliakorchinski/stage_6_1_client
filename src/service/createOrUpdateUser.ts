import axios from 'axios';

import type { User } from '../components/Form/Form';

export const createOrUpdateUser = async (
  method: string,
  id: string | undefined,
  data: Partial<User>
) => {
  const url = `http://localhost:3001/api/users${id ? `/${id}` : ''}`;
  try {
    return await axios({
      method,
      url,
      data: data,
    });
  } catch (err) {
    console.error(err);
  }
};
