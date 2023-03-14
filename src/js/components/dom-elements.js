const formInput = document.querySelector('#url-input');
const formLabel = document.querySelector('.feedback');
const button = document.querySelector('form button');
const cardName = document.querySelector('.feeds .card-body h2');
const listOfFeeds = document.querySelector('.feeds .list-group');
const cardNamePost = document.querySelector('.posts .card-body h2');
const listOfPosts = document.querySelector('.posts .list-group');
const modalTitle = document.querySelector('.modal-title');
const modalBody = document.querySelector('.modal-body');
const btnCheck = document.querySelector('.modal-footer a');

export {
  formInput, formLabel, button, cardName, listOfFeeds,
  cardNamePost, listOfPosts, modalTitle, modalBody, btnCheck,
};
