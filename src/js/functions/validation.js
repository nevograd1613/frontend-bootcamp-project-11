import * as yup from 'yup';

const validate = (content, listOfFeeds) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'validation.errors.errorUniqRssUrl',
    },
    string: {
      url: 'validation.errors.errorURL',
      min: 'validation.errors.errorRequired',
    },
  });

  const schema = yup.string().url().min(1).notOneOf(listOfFeeds);

  return schema.validate(content);
};

export default validate;
