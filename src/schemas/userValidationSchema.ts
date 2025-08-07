import * as yup from 'yup';

export const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .max(30, 'Username must be at most 30 characters'),

  email: yup.string().email('Invalid email').optional(),
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),

  age: yup.number().typeError('Age must be a number').min(0, 'Age must be non-negative').optional(),

  role: yup
    .string()
    .oneOf(['admin', 'user', 'manager'], 'Invalid role')
    .required('Role is required'),

  isActive: yup.boolean().optional(),

  tasks: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Task name is required'),
      status: yup
        .string()
        .oneOf(['todo', 'in_progress', 'done'], 'Invalid status')
        .required('Status is required'),
    })
  ),
});
