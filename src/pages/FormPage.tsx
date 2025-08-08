import { Form } from '../components/Form/Form';

type Mode = 'create' | 'edit';

export const FormPage = ({ mode }: { mode: Mode }) => {
  return <Form mode={mode} />;
};
