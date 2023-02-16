import onChange from 'on-change';
import state from '../components/state.js';
import { i18nInstance } from './init.js';
import render, { renderFeedback } from './render.js';

const watchedState = onChange(state, (path, value, previousValue) => {
   if (path === 'languadge') {
      i18nInstance.changeLanguage(value).then(() => render(watchedState, i18nInstance));
    }
    if (path === 'link' || path === 'isValid') {
      renderFeedback(watchedState, i18nInstance)
    }
});
export default watchedState;