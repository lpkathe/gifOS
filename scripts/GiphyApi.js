const protocol = "https:";
const DOMAIN = (`${protocol}//api.giphy.com/v1/gifs`);
const urlSearch = (`${DOMAIN}/search`);
const urlAutocompleteSearch = (`${urlSearch}/tags`);
const urlTrendingCategories = (`${DOMAIN}/categories`);
const urlTrendingGifos = (`${DOMAIN}/trending`);
const apiKey = `api_key=RdoBL837xzyR4wgjoqf8FocqUIoxGh0q`;

const GiphyApi = {
  search: ((input, limit, offset = 0) => {
    return new Promise((resolve, reject) => {
      fetch(`${urlSearch}?${apiKey}&q=${input}&limit=${limit}&offset=${offset}`)
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    });
  }),

  autocompleteSearch: ((input, limit = 4) => {
    return new Promise((resolve, reject) => {
      fetch(`${urlAutocompleteSearch}?${apiKey}&q=${input}&limit=${limit}&offset=0`)
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    });
  }),

  trendingCategories: ((limit = 5) => {
    return new Promise((resolve, reject) => {
      fetch(`${urlTrendingCategories}?${apiKey}&limit=${limit}`)
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    });
  }),

  trendingGifs: ((limit, offset) => {
    return new Promise((resolve, reject) => {
      fetch(`${urlTrendingGifos}?${apiKey}&limit=${limit}&offset=${offset}`)
        .then((response) => resolve(response.json()))
        .catch((error) => reject(error))
    });
  }),

  gifById: ((id) => {
    return new Promise((resolve, reject) => {
      fetch(`${DOMAIN}${id}?${apiKey}`)
      .then((response) => resolve(response.json()))
      .catch((error) => reject(error))
    });
  }),

  gifsById: ((ids) => {
    return new Promise((resolve, reject) => {
      fetch(`${DOMAIN}?ids=${ids}&${apiKey}`)
      .then((response) => resolve(response.json()))
      .catch((error) => reject(error))
    });
  }),
};

export default GiphyApi;