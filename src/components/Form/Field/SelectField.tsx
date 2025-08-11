import type { FC, ReactNode } from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SxProps, type Theme } from '@mui/material';
import { Controller, useFormContext, type FieldPath } from 'react-hook-form';
import type { User } from '../Form';

type SelectFieldProps = {
  name: FieldPath<Partial<User>>;
  items: string[];
  label: string;
  children?: ReactNode;
  sx?: SxProps<Theme>;
};

export const SelectField: FC<SelectFieldProps> = ({ name, items, label, children, sx }) => {
  const { control } = useFormContext();
  return (
    <FormControl fullWidth sx={sx}>
      <InputLabel>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        defaultValue={name}
        render={({ field }) => (
          <Select {...field} label={label}>
            {items.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {children}
    </FormControl>
  );
};
