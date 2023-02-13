import * as yup from 'yup';
import state from '../components/state.js';

const validation = (text) => {
   const schema = yup.string().required().url();
   return schema.validate(text)
   .then()
   .catch((e) => {
      state.errors = e.message;
   });
};

export default validation;
