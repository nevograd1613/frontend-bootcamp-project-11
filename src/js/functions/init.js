import i18next from 'i18next';
import resources from '../components/locales.js/index.js';
import render from './render.js';
import watchedState from './watchedState.js';

export const i18nInstance = i18next.createInstance();
i18nInstance.init({
   lng: ['ru', 'en'],
   debug: true,
   resources,
 }).then(() => render(watchedState, i18nInstance));

export default () => {
 i18nInstance;
}

