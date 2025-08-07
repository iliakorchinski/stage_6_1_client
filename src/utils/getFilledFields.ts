import { type User } from '../components/Form/Form';

export const getFilledFields = (data: User) => {
  const changedFields = Object.fromEntries(
    Object.entries(data).filter(
      // eslint-disable-next-line
      ([_, value]) =>
        value != null &&
        (typeof value !== 'string' || value.trim() !== '') &&
        (!Array.isArray(value) || value.length > 0)
    )
  );
  return changedFields;
};
