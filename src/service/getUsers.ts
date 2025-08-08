import axios from 'axios';

export const getUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/users');
    const data = response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};
