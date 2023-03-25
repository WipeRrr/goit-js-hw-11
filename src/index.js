import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages, resetPage } from './js/fetchImages';
import InfiniteScroll from 'infinite-scroll';


const inputEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector(`.load-more`);
const endCollectionText = document.querySelector(`.end-collection-text`);

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentHits = 0;
let name = '';

inputEl.addEventListener('submit', onSearch);
loadMoreEl.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  name = e.currentTarget.searchQuery.value;
  resetPage();
  if (name === '') {
    return;
  }
  e.currentTarget.reset();
  const response = await fetchImages(name);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreEl.classList.remove('is-hidden');
  } else {
    loadMoreEl.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      clearGallery();
      renderImg(response);
      lightbox.refresh();
      endCollectionText.classList.add('is-hidden');
    }
    if (currentHits === response.totalHits) {
      loadMoreEl.classList.add('is-hidden');
      endCollectionText.classList.remove('is-hidden');
    }

    if (response.totalHits === 0) {
      clearGallery();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreEl.classList.add('is-hidden');
      endCollectionText.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  
  const response = await fetchImages(name);
  renderImg(response);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreEl.classList.add('is-hidden');
    endCollectionText.classList.remove('is-hidden');
  }
  smoothScroll();
}

function renderImg(data) {
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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}




 let infScroll = new InfiniteScroll(galleryEl, {
   // options
   path: '.pagination__next',
   append: '.photo-card',
   history: false,
 });


galleryEl.infiniteScroll({
  path: '.pagination__next',
  append: '.photo-card',
  history: false,
  status: '.page-load-status',
});