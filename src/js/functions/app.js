import {
  uniqueId, differenceWith, isEqual, isEmpty,
} from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import languages from '../components/locales/index.js';
import parserRss from './parserRss.js';
import watcher from './view.js';
import validate from './validation.js';
import state from '../components/state.js';

const setIdForTopics = (topics) => {
  topics.forEach((topic) => {
    topic.id = uniqueId();
  });
};

const handlerOfTheReadPost = (watchedState) => {
  document.querySelector('.posts').addEventListener('click', (e) => {
    console.log('click');
    const { id } = e.target.dataset;
    watchedState.uiState.isRead.push(id);
  });
};

const openModalWindow = (stat, watchedState) => {
  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (e) => {
    const button = e.relatedTarget;
    const { id } = button.dataset;
    const currentPost = stat.rssContent.topics.find((topic) => topic.id === id);
    watchedState.uiState.viewedPost = currentPost;
  });
};

const addRss = (stat, watchedState) => {
  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const content = formData.get('url');

    validate(content, stat.rssContent.resources)
      .then(() => {
        watchedState.rssContent.loading = 'sending';
        const proxy = new URL(`https://allorigins.hexlet.app/get?disableCache=true&url=${content}`);
        return axios.get(proxy);
      })
      .then((response) => parserRss(response))
      .then(({ feed, topics }) => {
        stat.rssContent.resources.unshift(content);
        stat.rssContent.feeds.unshift(feed);

        setIdForTopics(topics);
        stat.rssContent.topics.unshift(...topics);

        stat.isError = false;
        watchedState.rssContent.loading = 'finished';

        handlerOfTheReadPost(watchedState);
        openModalWindow(stat, watchedState);
      })
      .catch((error) => {
        stat.isError = true;
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

const updateRss = (stat, watchedState) => {
  const proxy = 'https://allorigins.hexlet.app/get?disableCache=true&url=';

  // eslint-disable-next-line arrow-body-style
  const promises = stat.rssContent.resources.map((resource) => {
    return axios.get(`${proxy}${resource}`)
      .then((response) => parserRss(response))
      .catch((error) => {
        switch (error.name) {
          case 'AxiosError':
            stat.errors = 'update.errors.errorNetWork';
            break;
          case 'ParsingError':
            stat.errors = 'update.errors.errorResource';
            break;
          default:
            throw new Error();
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

  setTimeout(() => updateRss(watchedState), 5000);
};

export default () => {
  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: languages.ru,
  });

  const watchedState = watcher(state, i18n);
  addRss(state, watchedState);
  updateRss(state, watchedState);
};
