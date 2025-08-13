import axios from 'axios';

export const getUser = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/api/users/${id}`);
    return response.data;
  } catch (err) {
    console.error('Could not fetch user:', err);
  }
};
