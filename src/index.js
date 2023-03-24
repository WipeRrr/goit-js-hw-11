import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';

const inputEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector(`.load-more`);

inputEl.addEventListener('submit', onSearch);

loadMoreEl.addEventListener('click', onLoadMore);

let name = '';

function onSearch(e) {
  e.preventDefault();
  name = e.currentTarget.searchQuery.value;
  page = 1;
  if (name === '') {
    return;
  }
  e.currentTarget.reset();
  fetchImages(name)
    .then(renderImg)
    .catch(error => {
      console.log(error);
    });
  clearGallery();
  loadMoreEl.classList.remove(`is-hidden`);
  refresh();
}

function onLoadMore() {
  fetchImages(name)
    .then(renderImg)
    .catch(error => {
      console.log(error);
    });
  refresh();
}

function renderImg(data) {
  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
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
        pageURL,
      }) => {
        return `<div class="photo-card">
        <a class="gallery__item" href="${largeImageURL}">
  <img class="gallery__image" src="${webformatURL}" alt="${tags} " loading="lazy" /> </a>
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

  new SimpleLightbox('.photo-card a', {
    captionDelay: 250,
  });
}

function clearGallery() {
  galleryEl.innerHTML = '';
}
