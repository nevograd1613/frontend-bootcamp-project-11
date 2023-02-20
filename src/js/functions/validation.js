import * as yup from 'yup';

const validation = (text) => {
   yup.setLocale({
      string: {
         url: 'feedbackNotDone',
       },
   })
   const schema = yup.string().url();
   return schema.validate(text)
   .then(() => {
      return true;
   })
   .catch((e) => {
      return false;
   });
};

export default validation;
