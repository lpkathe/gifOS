import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const inputSearch = document.getElementById("inputSearch");
const iconSearch = document.getElementById("iconSearch");
const suggestedList = document.querySelector(".search__form__list");
const pTrendingCategories = document.querySelector(".search__p");
const resultsContainer = document.querySelector("results__container");
const resultsTitle = document.querySelector(".results__title");
const resultsCards = document.querySelector(".results__cards");

/**
 * Functions that load with the page.
 */
function onLoad() {
    getTrendingCategories();
};

/**
 * Get gifs of the search results and display then on html
 */
function search(pagination) {
    const { search } = GiphyApi;

    resultsTitle.innerText = capitalize(inputSearch.value);
    resultsCards.innerHTML = "";

    search(inputSearch.value)
        .then((response) => {
            response.data.forEach((element) => {
                createCard(element.images.original.url);
            })
        }).catch ((error) => {
            resultsCards.innerText = "Error "+ error;
        })
    
    btnSearchResults(pagination);
};

/**
 * Create cards for results
 * @param {string} url 
 * @param {string} title 
 */
function createCard(url) {
    const card = document.createElement("img");
    
    card.src = url;
    card.className = "results__card";
    
    resultsCards.appendChild(card);
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
            list.push(capitalize(element.name));
        });
        pTrendingCategories.innerText = list.join(', ');
    }) .catch ((error) => {
        pTrendingCategories.innerText = "Error "+ error;
    });
};

/**
 * Suggestion search
 */
function getAutocompleteSearch(event) {
    const { autocompleteSearch } = GiphyApi;

    suggestedList.innerText = "";

    autocompleteSearch(inputSearch.value)
        .then((response) => {
            response.data.forEach((element) => {
                const li = document.createElement('li');
                li.value = element.name;
                li.className = "search__form__li";
                suggestedList.appendChild(li);
            });
        }).catch ((error) => {
            console.log(error);
        });
    
    if (event.keyCode == 13) {
        search();
    }
};

/**
 * make first letter of a string uppercase
 * @param {string} text 
 */
function capitalize(text) {
    if (text.length <= 0 ) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1); 
};

/**
 * Create button for more results
 * @param {number} pagination 
 */
function btnSearchResults(pagination) {
    const btnVerMas = create.Element("button");

    if (pagination.element = pagination[0]){
        resultsContainer.appendChild(btnVerMas);
        btnVerMas.value = "VER MÁS";
        btnVerMas.className = "results__button";
    }

    if (pagination.element = pagination.length) {
        resultsContainer.removeChild(button);
    } else {
        return pagination;
    }
};

/**
 * Events
 */

window.addEventListener("load", onLoad);
inputSearch.addEventListener("keypress", getAutocompleteSearch);
iconSearch.addEventListener("click", search);
btnVerMas.addEventListener("click", search);