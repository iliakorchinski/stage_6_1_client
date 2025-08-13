import axios from 'axios';

export const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/users');
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
