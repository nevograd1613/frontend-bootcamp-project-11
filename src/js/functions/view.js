import onChange from 'on-change';
import {
  renderFeedback, renderFeeds, renderOfReadPosts, renderPosts,
  renderModalWindow, renderLockForm, renderUnlockForm,
} from './render.js';

export default (state, i18n) => onChange(state, (path, value) => {
  switch (path) {
    case 'errors':
      renderFeedback(state.isError, value, i18n);
      break;
    case 'rssContent.loading':
      switch (value) {
        case 'sending':
          renderLockForm();
          break;
        case 'finished':
          renderFeedback(state.isError, 'loading.isLoaded', i18n);
          renderFeeds(state, i18n);
          renderPosts(state, i18n);
          renderUnlockForm();
          break;
        case 'failed':
          renderUnlockForm();
          break;
        default:
          throw new Error();
      }
      break;
    case 'rssContent.updating':
      switch (value) {
        case 'requested':
          break;
        case 'updated':
          renderPosts(state, i18n);
          break;
        case 'failed':
          renderFeedback(false, state.feedback, i18n);
          break;
        default:
          throw new Error();
      }
      break;
    case 'uiState.viewedPost':
      renderModalWindow(value);
      break;
    case 'uiState.isRead': {
      renderOfReadPosts(value);
      break;
    }
    default:
      throw new Error();
  }
});
