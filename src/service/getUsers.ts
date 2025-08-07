import axios from 'axios';

export const fetchUsers = async () => {
  const response = await axios.get('http://localhost:3001/api/users');
  const data = response.data;
  return data;
};
