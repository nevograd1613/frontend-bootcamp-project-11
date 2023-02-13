import onChange from 'on-change';
import { form, formInput, formLabel } from "../components/variables.js";
import validation from "./validation.js";

const render = (state) => {
   form.addEventListener('submit', (e) => {
      e.preventDefault();
      formInput.focus();
      const formData = new FormData(e.target);
      state.errors = validation(formData.get('url'));
      state.errors.then((data) => {
         if (data !== undefined) {
            if (state.feeds.length === 0) {
               formInput.classList.remove('is-invalid')
               formLabel.textContent = 'RSS успушно загружен';
               formLabel.classList.remove('text-danger');
               formLabel.classList.add('text-success');
               state.feeds.push(data);
            } else {
               if (!state.feeds.includes(data)) {
                  formInput.classList.remove('is-invalid')
                  formLabel.textContent = 'RSS успушно загружен';
                  formLabel.classList.remove('text-danger');
                  formLabel.classList.add('text-success');
                  state.feeds.push(data);
               } else {
                  formInput.classList.add('is-invalid')
                  formLabel.textContent = 'RSS уже существует';
                  formLabel.classList.remove('text-success');
                  formLabel.classList.add('text-danger');
               }
            }
         } else {
            formInput.classList.add('is-invalid')
            formLabel.textContent = 'Ссылка должна быть валидным URL';
            formLabel.classList.remove('text-success');
            formLabel.classList.add('text-danger');
         }
      });
      console.log(state);
      const watchedState = onChange(state, (path, value, previousValue) => {

      });
      form.reset();
   });
};
export default render;