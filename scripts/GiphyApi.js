
const domain = `http://api.giphy.com/v1/gifs/`;
const urlSearch = domain + "search";
const urlTrending = domain + "trending";
const apiKey = `api_key=RdoBL837xzyR4wgjoqf8FocqUIoxGh0q`;

const GiphyApi = {
    search: ((input, limit = 12) => {
        return new Promise((resolve, reject) => {
            fetch(`${urlSearch}?${apiKey}&q=${input}&limit=${limit}&offset=0`)
            .then((response) => resolve(response.json()))
            .catch((error) => reject(error))
          });
    }),
    autocomplete: (()=>{}),
    trending: ((limit = 5) => {
        return new Promise((resolve, reject) => {
            fetch(`${urlTrending}?${apiKey}&limit=${limit}&offset=0`)
            .then((response) => resolve(response.json()))
            .catch((error) => reject(error))
          });
    }),

}

export default GiphyApi;