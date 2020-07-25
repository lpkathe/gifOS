const searchURL = `http://api.giphy.com/v1/gifs/search`;
const apiKey = `api_key=RdoBL837xzyR4wgjoqf8FocqUIoxGh0q`;

const GiphyApi = {
    search: ((input, limit = 12) => {
        return new Promise((resolve, reject) => {
            fetch(`${searchURL}?${apiKey}&q=${input}&limit=${limit}&offset=0`)
            .then((response) => resolve(response.json()))
            .catch((error) => reject(error))
          });
    }),
    autocomplete: (()=>{}),
}

export default GiphyApi;