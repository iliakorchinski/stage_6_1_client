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
import { useEffect } from 'react';
import { getUser } from '../../service/getUser';

export type User = InferType<typeof schema>;

const roles = ['admin', 'user', 'manager'];

type Mode = 'create' | 'edit';

export const Form = ({ mode }: { mode: Mode }) => {
  const { id } = useParams();

  const defaultValues = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    age: 18,
    role: 'user',
    isActive: true,
    tasks: [],
  };

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
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

      let changedFields: Partial<User> = {};

      if (mode === 'create') {
        changedFields = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            const defVal = defaultValues?.[key as keyof User];

            if (Array.isArray(value) && value.length === 0) {
              return false;
            }
            return (value !== '' && value !== null) || (defVal !== '' && defVal !== null);
          })
        ) as Partial<User>;
      }

      if (mode === 'edit') {
        changedFields = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            if (!dirtyFields[key as keyof User]) {
              return false;
            }

            if (typeof value === 'string' && value.trim() === '') {
              return false;
            }
            return dirtyFields[key as keyof User];
          })
        ) as Partial<User>;
      }

      const url = `http://localhost:3001/api/users${id ? `/${id}` : ''}`;

      await axios({
        method,
        url,
        data: changedFields,
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
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Username"
            sx={{ gridColumn: 'span 6' }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Email"
            sx={{ gridColumn: 'span 2' }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="First Name"
            sx={{ gridColumn: 'span 2' }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
        )}
      />

      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Last Name"
            sx={{ gridColumn: 'span 2' }}
            InputLabelProps={{ shrink: true }}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        )}
      />

      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            label="Age"
            type="number"
            sx={{ gridColumn: 'span 3' }}
            error={!!errors.age}
            helperText={errors.age?.message}
          />
        )}
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

      <Controller
        name="isActive"
        control={control}
        defaultValue={true}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Active user"
            sx={{ gridColumn: 'span 6' }}
          />
        )}
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
            <Controller
              name={`tasks.${index}.name`}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Task Name"
                  error={errors.tasks && !!errors.tasks[index]?.name}
                  helperText={errors.tasks && errors.tasks[index]?.message}
                />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Controller
                control={control}
                name={`tasks.${index}.status`}
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
