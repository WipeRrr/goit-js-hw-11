import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEL = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEL.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const name = e.target.value.trim();
  clearContainer(listEl);
  clearContainer(countryInfoEl);
  if (name === '') {
    return;
  }

  fetchCountries(name)
    .then(renderList)
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderList(data) {
  if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  const markupList = data
    .map(({ name, flags }) => {
      return `<li><img src="${flags.png}" alt="${flags.alt}" width="60" height="40">${name.common}</li>`;
    })
    .join('');

  listEl.insertAdjacentHTML(`beforeend`, markupList);

  if (data.length === 1) {
    clearContainer(listEl);
    clearContainer(countryInfoEl);
    const markupInfo = data
      .map(({ name, flags, population, capital, languages }) => {
        return `<h1> <img src="${flags.svg}" alt="${
          flags.alt
        }" width="40" height="20"> ${name.common} </h1>
      <p> <span class="country-data">Capital:</span> ${capital} </P>
      <p> <span class="country-data">Population:</span> ${population}</P>
      <p> <span class="country-data">Languages:</span> ${Object.values(
        languages
      )} </P>
    `;
      })
      .join('');

    countryInfoEl.insertAdjacentHTML(`beforeend`, markupInfo);
  }
}

function clearContainer(ref) {
  ref.innerHTML = '';
}
