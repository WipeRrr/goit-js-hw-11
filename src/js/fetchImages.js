export const fetchImages =  name => {
  const BASE_URL = 'https://pixabay.com/api/';

  const searchParams = new URLSearchParams({
    key:'33763391-fe078dc9f17400c9e34720d71',
    q: name,
    image_type: `photo`,
    orientation: `horizontal`,
    safesearch: `true`,
  });

  return fetch(`${BASE_URL}?${searchParams}`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      console.error(error);
    });
};
