import GiphyApi from './GiphyApi.js'

/**
 * Global variables
 */
const inputSearch = document.getElementById("inputSearch");
const iconSearch = document.getElementById("iconSearch");
const resultsCards = document.querySelector(".results__cards");
const pTrendingCategories = document.querySelector(".search__p");
const suggestedSearch = document.getElementById("suggestedSearch");

/**
 * Functions that load with the page.
 */
function onLoad() {
    getTrendingCategories();
}

/**
 * Get gifs of the search results and display then on html
 */
function search() {
    const { search } = GiphyApi;
    
    search(inputSearch.value)
    .then((response) => {
        response.data.forEach((element) => {
            createImage(element.images.original.url);
        })
    }) .catch ((error) => {
        resultsContainer.innerText = "Error "+ error;
    });
}

/**
 * Create cards for results
 * @param {} url 
 * @param {*} title 
 */
function createImage(url, title) {
    const image = document.createElement("img");
    
    resultsCards.appendChild(image);
    
    image.src = url;
};

/**
 * Get trending titles
 */
function getTrendingCategories() {
    const { trendingCategories } = GiphyApi;
    let list = [];
    
    trendingCategories()
    .then((response) => {
        response.data.forEach((element) => {
            list.push(element.name);
        });
        pTrendingCategories.innerText = list.join(', ');
    }) .catch ((error) => {
        pTrendingCategories.innerText = "Error "+ error;
    });
};

/**
 * Suggestion search
 */
function getAutocompleteSearch() {
    const { autocompleteSearch } = GiphyApi;

    suggestedSearch.innerText = "";

    autocompleteSearch(inputSearch.value)
    .then((response) => {
        response.data.forEach((element) => {
            const option = document.createElement('option');
            suggestedSearch.appendChild(option);
            option.value = element.name;
        });
    });
};

/**
 * Events
 */

inputSearch.addEventListener("keypress", getAutocompleteSearch);
iconSearch.addEventListener("click", search);
window.addEventListener("load", onLoad);