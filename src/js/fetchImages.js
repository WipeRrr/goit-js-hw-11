import axios from 'axios';

export const fetchImages = name => {
  const BASE_URL = 'https://pixabay.com/api/';
  let page = 1;

  const searchParams = new URLSearchParams({
    key: '33763391-fe078dc9f17400c9e34720d71',
    q: name,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
    page: page,
  });

  return axios
    .get(`${BASE_URL}?${searchParams}&per_page=40`)
    .then( data  => {
      page += 1;
      return data;
    })
    .catch(error => {
      console.error(error);
    });
};
