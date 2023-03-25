import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, resetPage } from './js/fetchImages';

const inputEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector(`.load-more`);
const endText = document.querySelector(`.end-collection-text`);

inputEl.addEventListener('submit', onSearch);
loadMoreEl.addEventListener('click', onLoadMore);

let currentHits = 0;
let name = '';

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearch(e) {
  e.preventDefault();
  name = e.currentTarget.searchQuery.value;
  resetPage();
  if (name === '') {
    return;
  }
  e.currentTarget.reset();
  currentHits = 0;
  fetchImages(name)
    .then(renderImg)
    .catch(error => {
      console.log(error);
    });
  clearGallery();
  loadMoreEl.classList.remove(`is-hidden`);
}

function onLoadMore() {
  fetchImages(name)
    .then(renderImg)
    .catch(error => {
      console.log(error);
    });
}

function renderImg(data) {
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreEl.classList.add(`is-hidden`);
  }
  currentHits += data.hits.length;
  console.log(currentHits);
  if (currentHits === data.totalhits) {
    loadMoreEl.classList.add(`is-hidden`);
    endText.classList.remove(`is-hidden`);
     console.log(endText);
  }
  console.log(endText);
  const markup = data.hits
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
        <a class="gallery-item" href="${largeImageURL}">
  <img class="gallery-image" src="${webformatURL}" alt="${tags} " loading="lazy" /> </a>
  <div class="info">
    <p class="info-item">
      <b>Likes<span class="img_stats">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views<span class="img_stats">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments<span class="img_stats">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads<span class="img_stats">${downloads}</span></b>
    </p>
  </div>
</div>
    `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML(`beforeend`, markup);

  lightbox.refresh();
}

function clearGallery() {
  galleryEl.innerHTML = '';
}
