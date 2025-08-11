import { Controller, type FieldPath, get, useFormContext } from 'react-hook-form';
import type { User } from '../Form';
import type { FC } from 'react';
import { TextField } from '@mui/material';

type FieldTextProps = {
  name: FieldPath<Partial<User>>;
  span?: string;
  label?: string;
};

export const FieldText: FC<FieldTextProps> = ({ name, span, label }) => {
  const {
    control,
    formState: { errors: errors2 },
  } = useFormContext();
  const error = get(errors2, name);

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
