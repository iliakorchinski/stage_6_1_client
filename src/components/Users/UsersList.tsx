import { useEffect, useState } from 'react';
import classes from './UsersList.module.css';
import { type User } from '../../types/user';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../service/getUsers';
import { Box, List, ListItem, Typography } from '@mui/material';

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    fetchData();
  }, []);

  return (
    <Box>
      {users.map((user) => (
        <Box key={user.id} className={classes.card}>
          <Box className={classes.header}>
            <Typography variant="h3" component="h3">
              {user.username}
            </Typography>
            <Typography
              component="span"
              className={user.isActive ? classes.active : classes.inactive}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Typography>
          </Box>
          <Typography component="p">
            <Typography component="strong">Email:</Typography> {user.email}
          </Typography>
          <Typography component="p">
            <Typography component="strong">Full Name:</Typography> {user.firstName} {user.lastName}
          </Typography>
          <Typography component="p">
            <Typography component="strong">Age:</Typography> {user.age}
          </Typography>
          <Typography component="p">
            <Typography component="strong">Role:</Typography> {user.role}
          </Typography>
          <Box className={classes.taskList}>
            <Typography component="strong">Tasks:</Typography>
            <List>
              {user.tasks &&
                user.tasks.map((task, index) => (
                  <ListItem key={index}>
                    <Typography component="span" className={classes.status}>
                      {task.name} --- {task.status}
                    </Typography>
                  </ListItem>
                ))}
            </List>
            <Link to={`/edit/${user.id}`}>Edit</Link>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
