import { type User } from '../components/Form/Form';

export const getChangedFields = (newData: User, oldData: User) => {
  const changedEntries = Object.entries(newData).filter(([key, value]) => {
    const typedKey = key as keyof User;
    const oldValue = oldData[typedKey];

    const bothEmpty =
      (oldValue === undefined || oldValue === null) &&
      ((typeof value === 'string' && value.trim() === '') ||
        (Array.isArray(value) && value.length === 0) ||
        value === null ||
        value === undefined);

    if (bothEmpty) return false;

    if (Array.isArray(value)) {
      return JSON.stringify(value) !== JSON.stringify(oldValue);
    }

    return value !== oldValue;
  });

  console.log(Object.fromEntries(changedEntries));
  return Object.fromEntries(changedEntries);
};
