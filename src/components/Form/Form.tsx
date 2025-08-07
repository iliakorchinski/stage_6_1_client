import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import { schema } from '../../schemas/userValidationSchema';
import { type InferType } from 'yup';
import { useEffect, useState } from 'react';
import { getUser } from '../../service/getUser';
import { getFilledFields } from '../../utils/getFilledFields';
import { getChangedFields } from '../../utils/getChangedfields';

export type User = InferType<typeof schema>;

const roles = ['admin', 'user', 'manager'];

export const UserForm = () => {
  const [existingUser, setExistingUser] = useState<User | undefined>();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      age: 18,
      role: 'user',
      isActive: true,
      tasks: [],
    },
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });

  const onSubmit = async (data: User) => {
    try {
      const method = id ? 'PATCH' : 'POST';
      const isEdit = !!id;

      let payload: Partial<User>;

      if (isEdit && existingUser) {
        payload = getChangedFields(data, existingUser);
      } else {
        payload = getFilledFields(data);
      }

      const url = `http://localhost:3001/api/users${id ? `/${id}` : ''}`;

      await axios({
        method,
        url,
        data: payload,
      });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const data = await getUser(id);
        if (data) {
          reset(data);
          setExistingUser(data);
        }
      }
    };
    fetchUser();
  }, [id, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        border: '1px solid black',
        p: 2,
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(6, 1fr)',
      }}
    >
      <TextField
        fullWidth
        label="Username"
        {...register('username')}
        sx={{ gridColumn: 'span 6' }}
        InputLabelProps={{ shrink: true }}
        error={!!errors.username}
        helperText={errors.username?.message}
      />

      <TextField
        fullWidth
        label="Email"
        {...register('email')}
        sx={{ gridColumn: 'span 2' }}
        InputLabelProps={{ shrink: true }}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        fullWidth
        label="First Name"
        {...register('firstName')}
        sx={{ gridColumn: 'span 2' }}
        InputLabelProps={{ shrink: true }}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        fullWidth
        label="Last Name"
        {...register('lastName')}
        sx={{ gridColumn: 'span 2' }}
        InputLabelProps={{ shrink: true }}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      <TextField
        fullWidth
        label="Age"
        type="number"
        {...register('age')}
        sx={{ gridColumn: 'span 3' }}
        error={!!errors.age}
        helperText={errors.age?.message}
      />
      <FormControl fullWidth sx={{ gridColumn: 'span 3' }}>
        <InputLabel id="role-label">Role</InputLabel>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select labelId="role-label" label="Role" {...field}>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <FormControlLabel
        control={<Checkbox defaultChecked {...register('isActive')} />}
        label="Active user"
        sx={{ gridColumn: 'span 6' }}
      />

      <Box sx={{ gridColumn: 'span 6' }}>
        <Typography variant="h6" mb={1}>
          Tasks
        </Typography>

        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '3fr 2fr auto',
              gap: 2,
              mb: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              fullWidth
              label="Task Name"
              {...register(`tasks.${index}.name`)}
              error={errors.tasks && !!errors.tasks[index]?.name}
              helperText={errors.tasks && errors.tasks[index]?.message}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Controller
                control={control}
                name={`tasks.${index}.status`}
                defaultValue="todo"
                render={({ field }) => (
                  <Select {...field} label="Status">
                    <MenuItem value="todo">To Do</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                  </Select>
                )}
              />
              {errors.tasks?.[index]?.status && (
                <Typography variant="caption" color="error">
                  {errors.tasks[index]?.status?.message}
                </Typography>
              )}
            </FormControl>

            <IconButton color="error" onClick={() => remove(index)}>
              Remove
            </IconButton>
          </Box>
        ))}

        <Button variant="outlined" onClick={() => append({ name: '', status: 'todo' })}>
          Add Task
        </Button>
      </Box>

      <Button type="submit" variant="contained" sx={{ gridColumn: 'span 6' }}>
        Submit
      </Button>
    </Box>
  );
};
