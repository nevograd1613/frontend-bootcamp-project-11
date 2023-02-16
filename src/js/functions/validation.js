import * as yup from 'yup';
import state from '../components/state.js';

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
