import * as yup from 'yup';

const validation = (text) => {
  yup.setLocale({
    string: {
      url: 'feedbackNotDone',
    },
  });
  const schema = yup.string().url();
  return schema.validate(text)
    .then(() => true)
    .catch(() => false);
};

export default validation;
