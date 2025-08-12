import { Box, Button, Checkbox, FormControlLabel, IconButton, Typography } from '@mui/material';
import classes from './Form.module.css';
import axios from 'axios';
import { useForm, Controller, useFieldArray, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import { schema } from '../../schemas/userValidationSchema';
import { type InferType } from 'yup';
import { FieldText } from './Field/FieldText';
import { SelectField } from './Field/SelectField';
import type { FC } from 'react';
import { compose, isNil, negate, isEqual } from 'lodash/fp';

export type User = InferType<typeof schema>;

type FormProps = {
  defaultValues: User;
};

const roles = ['admin', 'user', 'manager'];
const statuses = ['todo', 'in_progress', 'done'];

const resolver = yupResolver(schema);

export const Form: FC<FormProps> = ({ defaultValues }) => {
  const { id } = useParams();

  const isEditMode = !!id;

  const navigate = useNavigate();

  const methods = useForm<User>({
    defaultValues,
    resolver,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });
  const onSubmit = async (data: Partial<User>) => {
    try {
      const method = id ? 'PATCH' : 'POST';

      let changedFields: Partial<User> = {};

      if (!isEditMode) {
        changedFields = Object.fromEntries(
          Object.entries(data).filter(([key, value]) => {
            const defVal = defaultValues?.[key as keyof User];

            if (Array.isArray(value) && value.length === 0) {
              return false;
            }

            const isNotEmpty = (v: unknown) =>
              compose((valid) => valid && !isEqual(v, ''), negate(isNil))(v);
            return isNotEmpty(value) || isNotEmpty(defVal);
          })
        ) as User;
      }

      if (isEditMode) {
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
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <FieldText name="username" span="span 6" />

        <FieldText name="email" span="span 2" />

        <FieldText name="firstName" span="span 2" />

        <FieldText name="lastName" span="span 2" />

        <FieldText name="age" span="span 3" />

        <SelectField name="role" items={roles} label="Role" sx={{ gridColumn: 'span 3' }} />

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
              <FieldText name={`tasks.${index}.name`} label="Task Name" />

              <SelectField name={`tasks.${index}.status`} items={statuses} label="Status">
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
      </form>
    </FormProvider>
  );
};
