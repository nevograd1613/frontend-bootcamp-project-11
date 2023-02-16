import { form, formInput, formLabel, btnGroup, h1Title, pLead, pExample, btnAdd, formInputPlaceholder } from "../components/variables.js";
import validation from "./validation.js";

const render = (state, i18nInstance) => {
   const languages = ['ru', 'en'];
   btnGroup.innerHTML = '';
   const handleSwitchLanguage = (state) => (evt) => {
      const { lng } = evt.target.dataset;
      state.languadge = lng;
      };

   languages.forEach((lng) => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      const className = state.languadge === lng ? 'btn-primary' : 'btn-outline-primary';
      btn.classList.add('btn', 'mb-3', className);
      btn.setAttribute('data-lng', lng);
      btn.textContent = i18nInstance.t(`btnSelectionLanguadge.${lng}`);
      btn.addEventListener('click', handleSwitchLanguage(state));
      btnGroup.appendChild(btn);
      });

   h1Title.textContent = i18nInstance.t('h1Title');
   pLead.textContent = i18nInstance.t('pLead');
   pExample.textContent = i18nInstance.t('pExample');
   btnAdd.textContent = i18nInstance.t('btnAdd');
   formInputPlaceholder.textContent = i18nInstance.t('formInputPlaceholder');

   form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      validation(formData.get('url'))
      .then((isValid) => {
         state.link = formData.get('url');
         state.isValid = isValid;
      });
      form.reset();
      formInput.focus();
   });
};



export const renderFeedback = (state, i18nInstance) => {
   if (state.isValid) {
      if (!state.links.includes(state.link)) {
         formInput.classList.remove('is-invalid')
         formLabel.textContent = i18nInstance.t('errors.feedbackDone');
         formLabel.classList.remove('text-danger');
         formLabel.classList.add('text-success');
         state.links.push(state.link);
      } else {
         formInput.classList.add('is-invalid')
         formLabel.textContent = i18nInstance.t('errors.feedbackAlreadyExist');
         formLabel.classList.remove('text-success');
         formLabel.classList.add('text-danger');
      }
   } else {
      formInput.classList.add('is-invalid')
      formLabel.textContent = i18nInstance.t('errors.feedbackNotDone');
      formLabel.classList.remove('text-success');
      formLabel.classList.add('text-danger');
   }
   console.log(state);
};

export default render;