import axios from 'axios';

let page = 1;

export async function fetchImages(name) {
  const BASE_URL = 'https://pixabay.com/api/';

  const searchParams = new URLSearchParams({
    key: '33763391-fe078dc9f17400c9e34720d71',
    q: name,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
  });

  const response = await axios.get(
    `${BASE_URL}?${searchParams}&per_page=40&page=${page}`
  );
  page += 1;
  return response.data;
}

export function resetPage() {
  page = 1;
}
