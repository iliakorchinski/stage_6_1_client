import * as yup from 'yup';

export const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .max(30, 'Username must be at most 30 characters')
    .nonNullable()
    .defined() as yup.StringSchema<string>,

  email: yup.string().email('Invalid email').nullable().optional().default(null),
  firstName: yup
    .string()
    .max(30, 'firsName must be at most 30 characters')
    .nullable()
    .optional()
    .default(null),
  lastName: yup.string().nullable().optional().default(null),

  age: yup
    .number()
    .typeError('Age must be a number')
    .min(0, 'Age must be non-negative')
    .nullable()
    .optional()
    .default(null),

  role: yup
    .string()
    .oneOf(['admin', 'user', 'manager'], 'Invalid role')
    .required('Role is required'),

  isActive: yup.boolean().optional().default(null),

  tasks: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required('Task name is required'),
        status: yup
          .string()
          .oneOf(['todo', 'in_progress', 'done'], 'Invalid status')
          .required('Status is required'),
      })
    )
    .nullable()
    .optional()
    .default(null),
});
