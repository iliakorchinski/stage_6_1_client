import { Box, Button, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import {
  useForm,
  useFormContext,
  Controller,
  useFieldArray,
  type Resolver,
  FormProvider,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import { schema } from '../../schemas/userValidationSchema';
import { type InferType } from 'yup';
import { getUser } from '../../service/getUser';
import { FieldText } from './Field/FieldText';
import { SelectField } from './Field/SelectField';

export type User = InferType<typeof schema>;

const roles = ['admin', 'user', 'manager'];
const statuses = ['todo', 'in_progress', 'done'];

type Mode = 'create' | 'edit';

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

export const Form = ({ mode }: { mode: Mode }) => {
  const { id } = useParams();
  const methods = useFormContext();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<User>({
    defaultValues: async () => {
      if (id) {
        return await getUser(id);
      } else {
        return defaultValues;
      }
    },

    resolver: yupResolver(schema) as Resolver<User>,
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

  return (
    <FormProvider {...methods}>
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
        <FieldText name="username" errors={errors} control={control} span="span 6" />

        <FieldText name="email" errors={errors} control={control} span="span 2" />

        <FieldText name="firstName" errors={errors} control={control} span="span 2" />

        <FieldText name="lastName" errors={errors} control={control} span="span 2" />

        <FieldText name="age" errors={errors} control={control} span="span 3" />

        <SelectField
          name="role"
          control={control}
          selectItems={roles}
          label="Role"
          sx={{ gridColumn: 'span 3' }}
        />

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
              <FieldText
                name={`tasks.${index}.name`}
                errors={errors}
                control={control}
                label="Task Name"
              />

              <SelectField
                name={`tasks.${index}.status`}
                control={control}
                selectItems={statuses}
                label="Status"
              >
                {errors.tasks?.[index]?.status && (
                  <Typography variant="caption" color="error">
                    {errors.tasks[index]?.status?.message}
                  </Typography>
                )}
              </SelectField>

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
    </FormProvider>
  );
};
