import { Controller, type Control, type FieldErrors, type FieldPath, get } from 'react-hook-form';
import type { User } from '../Form';
import type { FC } from 'react';
import { TextField } from '@mui/material';

type FieldTextProps = {
  name: FieldPath<Partial<User>>;
  control: Control<User>;
  errors: FieldErrors<Partial<User>>;
  span?: string;
  label?: string;
};

export const FieldText: FC<FieldTextProps> = ({ name, control, errors, span, label }) => {
  const error = get(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          label={label || name}
          sx={{ gridColumn: span }}
          InputLabelProps={{ shrink: true }}
          error={!!error}
          helperText={error?.message ?? ''}
        />
      )}
    />
  );
};
