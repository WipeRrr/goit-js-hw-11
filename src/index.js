import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { fetchImages } from './js/fetchImages';

const inputEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

inputEl.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();
  const name = e.currentTarget.searchQuery.value;

  if (name === '') {
    return;
  }
  console.log(name);
  e.currentTarget.reset();
  fetchImages(name)
    .then(renderImg)
    .catch(error => {
      console.log(error);
    });
}

function renderImg(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags} " loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>
    `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML(`beforeend`, markup);
}
