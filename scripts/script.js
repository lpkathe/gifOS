import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const inputSearch = document.getElementById("inputSearch");
const iconSearch = document.getElementById("iconSearch");
const suggestedList = document.querySelector(".search__box__list");
const pTrendingCategories = document.querySelector(".search__p");
const resultsContainer = document.querySelector("results__container");
const resultsTitle = document.querySelector(".results__title");
const resultsCards = document.querySelector(".results__cards");
const btnVerMas = document.querySelector(".results__button");
const inputX = document.querySelector(".search__box__x");

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
    document.querySelector(".results__container").style.display = "flex";
    resultsCards.innerHTML = "";

    search(inputSearch.value)
        .then((response) => {
            response.data.forEach((element) => {
                createCard(element.images.original.url);
            })
        }).catch((error) => {
            resultsCards.innerText = "Error " + error;
        })

    searchReset();
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
        }).catch((error) => {
            pTrendingCategories.innerText = "Error " + error;
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
                suggestedList.appendChild(li);
                li.innerText = element.name;
                li.className = "search__box__li";
            });
        }).catch((error) => {
            console.log(error);
        });
        
        if (event.keycode === 13) {
            search();
            document.removeChild(li);
        }
};

/**
 * make first letter of a string uppercase
 * @param {string} text 
 */
function capitalize(text) {
    if (text.length <= 0) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Capture API suggestions in the input search. 
 * @param {string} suggested 
 */
function onSuggestedItemClicked(suggested) {
    inputSearch.value = suggested.target.innerText;
    suggestedList.innerText = "";
    search();
};

function searchReset() {
    suggestedList.innerText = "";
    inputSearch.innerText = "";
    console.log(inputSearch)
}

/**
 * Events
 */

window.addEventListener("load", onLoad);
inputSearch.addEventListener("keyup", getAutocompleteSearch);
iconSearch.addEventListener("click", search);
btnVerMas.addEventListener("click", search);
inputX.addEventListener("click", searchReset);
suggestedList.addEventListener("click", onSuggestedItemClicked);
