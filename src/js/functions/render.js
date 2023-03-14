import {
  button, formInput, formLabel, cardName, listOfFeeds, feed, header, definition,
  cardNamePost, listOfPosts, modalTitle, modalBody, btnCheck,
} from '../components/variables.js';

const renderFeedback = (isError, message, i18n) => {
  formLabel.textContent = i18n.t(message);

  if (formLabel.classList.contains('text-danger')) formLabel.classList.remove('text-danger');
  else formLabel.classList.remove('text-succsess');

  if (isError) {
    formInput.classList.add('is-invalid');
    formLabel.classList.add('text-danger');
  } else {
    if (formInput.classList.contains('is-invalid')) formInput.classList.remove('is-invalid');
    formLabel.classList.add('text-success');
    formInput.value = '';
  }

  formInput.focus();
};

const renderFeeds = (state, i18n) => {
  cardName.textContent = i18n.t('content.feeds');

  listOfFeeds.innerHTML = '';

  state.rssContent.feeds.forEach(({ title, description }) => {
    feed.classList.add('list-group-item', 'border-0', 'border-end-0');

    header.classList.add('h6', 'm-0');
    header.textContent = title;

    definition.classList.add('m-0', 'small', 'text-black-50');
    definition.textContent = description;

    feed.append(header, definition);
    listOfFeeds.append(feed);
  });
};

const renderOfReadPosts = (posts) => {
  posts.forEach((id) => {
    const post = document.querySelector(`a[data-id="${id}"]`);
    if (post.classList.contains('fw-bold')) post.classList.remove('fw-bold');
    post.classList.add('fw-normal', 'link-secondary');
  });
};

const renderPosts = (state, i18n) => {
  cardNamePost.textContent = i18n.t('content.posts');

  listOfPosts.innerHTML = '';

  state.rssContent.topics.forEach((topic) => {
    const post = document.createElement('li');
    post.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const title = document.createElement('a');
    title.classList.add('fw-bold');
    title.href = topic.link;
    title.dataset.id = topic.id;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    title.textContent = topic.title;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.dataset.id = topic.id;
    btn.dataset.bsToggle = 'modal';
    btn.dataset.bsTarget = '#modal';
    btn.textContent = i18n.t('content.view');

    post.append(title, btn);
    listOfPosts.append(post);
  });

  renderOfReadPosts(state.uiState.isRead);
};

const renderModalWindow = (viewedPost) => {
  const {
    description, title, link,
  } = viewedPost;

  modalTitle.textContent = title;

  modalBody.textContent = description;

  btnCheck.setAttribute('href', link);
};

const renderLockForm = () => {
  formInput.setAttribute('readonly', true);
  button.setAttribute('disabled', true);
};

const renderUnlockForm = () => {
  formInput.removeAttribute('readonly');
  button.removeAttribute('disabled');
};

export {
  renderFeedback, renderFeeds, renderOfReadPosts,
  renderPosts, renderModalWindow, renderLockForm, renderUnlockForm,
};
