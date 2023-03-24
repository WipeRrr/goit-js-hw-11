import axios from 'axios';
let page = 1;
let previousName = null;

export function fetchImages(name) {
  page = name === previousName ? page + 1 : 1;
  previousName = name;

  const BASE_URL = 'https://pixabay.com/api/';

  const searchParams = new URLSearchParams({
    key: '33763391-fe078dc9f17400c9e34720d71',
    q: name,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
  });
  return axios
    .get(`${BASE_URL}?${searchParams}&per_page=40&page=${page}`)
    .then(({ data }) => {
      console.log(page);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

export function resetPage() {
  page = 1;
}
