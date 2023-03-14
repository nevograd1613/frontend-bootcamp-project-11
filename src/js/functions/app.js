/* eslint-disable no-param-reassign */
import {
  uniqueId, differenceWith, isEqual, isEmpty,
} from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import languages from '../components/locales/index.js';
import parserRss from './parserRss.js';
import watcher from './view.js';
import validate from './validation.js';

const setIdForTopics = (topics) => {
  topics.forEach((topic) => {
    topic.id = uniqueId();
  });
};

const handlerOfTheReadPost = (watchedState) => {
  document.querySelector('.posts').addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    watchedState.uiState.isRead.push(id);
  });
};

const openModalWindow = (state, watchedState) => {
  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const { id } = button.dataset;
    const currentPost = state.rssContent.topics.find((topic) => topic.id === id);
    watchedState.uiState.viewedPost = currentPost;
  });
};

const addRss = (state, watchedState) => {
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const content = formData.get('url');

    validate(content, state.rssContent.resources)
      .then(() => {
        watchedState.rssContent.loading = 'sending';
        const proxy = new URL(`https://allorigins.hexlet.app/get?disableCache=true&url=${content}`);
        return axios.get(proxy);
      })
      .then((response) => parserRss(response))
      .then(({ feed, topics }) => {
        state.rssContent.resources.unshift(content);
        state.rssContent.feeds.unshift(feed);

        setIdForTopics(topics);
        state.rssContent.topics.unshift(...topics);

        state.isError = false;
        watchedState.rssContent.loading = 'finished';

        handlerOfTheReadPost(watchedState);
        openModalWindow(state, watchedState);
      })
      .catch((error) => {
        state.isError = true;
        switch (error.name) {
          case 'AxiosError':
            watchedState.errors = 'loading.errors.errorNetWork';
            break;
          case 'ParsingError':
            watchedState.errors = 'loading.errors.errorResource';
            break;
          case 'ValidationError':
            watchedState.errors = error.message;
            break;
          default:
            throw new Error('UnknownError');
        }
        watchedState.rssContent.loading = 'failed';
      });
  });
};

const updateRss = (state, watchedState) => {
  const proxy = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

  // eslint-disable-next-line arrow-body-style
  const promises = state.rssContent.resources.map((resource) => {
    return axios.get(`${proxy}${resource}`)
      .then((response) => parserRss(response))
      .catch((error) => {
        switch (error.name) {
          case 'AxiosError':
            state.errors = 'update.errors.errorNetWork';
            break;
          case 'ParsingError':
            state.errors = 'update.errors.errorResource';
            break;
          default:
            throw new Error('No update RSS');
        }
      });
  });

  Promise.all(promises)
    .then((parsedRss) => {
      parsedRss.forEach(({ topics }) => {
        const oldTopicsLinks = state.rssContent.topics.map((topic) => topic.link);
        const allTopicsLinks = topics.map((topic) => topic.link);
        const newTopicsLinks = differenceWith(allTopicsLinks, oldTopicsLinks, isEqual);
        if (isEmpty(newTopicsLinks)) return;

        const newTopics = newTopicsLinks
          .map((link) => topics.find((topic) => topic.link === link));

        setIdForTopics(newTopics);
        state.rssContent.topics.unshift(...newTopics);

        watchedState.rssContent.updating = 'updated';

        handlerOfTheReadPost(watchedState);
        openModalWindow(state, watchedState);
      });
    });

  setTimeout(() => updateRss(state, watchedState), 5000);
};

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: languages.ru,
  });

  const state = {
    feedback: '',
    isError: null,
    rssContent: {
      errors: null,
      updating: null,
      resources: [],
      feeds: [],
      topics: [],
    },
    uiState: {
      viewedPost: {},
      isRead: [],
    },
  };

  const watchedState = watcher(state, i18n);
  addRss(state, watchedState);
  updateRss(state, watchedState);
};
