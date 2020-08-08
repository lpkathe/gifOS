import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const inputSearch = document.getElementById("inputSearch");
const inputX = document.querySelector(".search__box__x");
const inputSearchRightIcon = document.querySelector(".search__box__icon");
const inputSearchLeftIcon = document.querySelector(".search__box__icon-list");

const suggestedList = document.querySelector(".search__box__list");
const pTrendingCategories = document.querySelector(".search__p");

const resultsContainer = document.querySelector(".results__container");
const resultsTitle = document.querySelector(".results__title");
const resultsCards = document.querySelector(".results__cards");

const btnVerMas = document.querySelector(".results__button");

let pageOffset = 0;
let pageCount = 0;
let pageTotalCount = 0;
const pageItems = 12;

/**
 * Functions that load with the page.
 */
function onLoad() {
  getTrendingCategories();
};

/**
 * Get gifs of the search results and display then on html
 */
function search() {
  const { search } = GiphyApi;

  resultsTitle.innerText = capitalize(inputSearch.value);
  resultsContainer.style.display = "flex";
  resultsCards.innerHTML = "";

  search(inputSearch.value, pageItems)
    .then((response) => {
      pageOffset = response.pagination.offset;
      pageTotalCount = response.pagination.total_count;
      pageCount = pageTotalCount - (response.pagination.count + pageOffset);

      if (pageCount < 1) {
        btnVerMas.style.display = "none";
      } else {
        btnVerMas.style.display = "inline";
      };

      response.data.forEach((element) => {
        createCard(element.images.original.url);
      })
    }).catch((error) => {
      resultsCards.innerText = "Error " + error;
    });

  isSearchingState(false);
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

  isSearchingState(inputSearch.value.length != 0 && event.keyCode !== 13);

  if (event.keyCode == 13) {
    search();
    return;
  }

  autocompleteSearch(inputSearch.value)
    .then((response) => {
      suggestedList.innerText = "";
      response.data.forEach((element) => {
        const li = document.createElement('li');
        suggestedList.appendChild(li);
        li.innerText = element.name;
        li.className = "search__box__li";
      });
    }).catch((error) => {
      console.log(error);
    });
};

/**
 * Verify search action
 * @param {Boolean} isSearching 
 */
function isSearchingState(isSearching = true) {
  if (isSearching) {
    inputX.style.display = "inline";
    inputSearchRightIcon.style.display = "none";
    inputSearchLeftIcon.style.visibility = "visible";
  } else {
    inputX.style.display = "none";
    inputSearchRightIcon.style.display = "inline";
    inputSearchLeftIcon.style.visibility = "hidden";
    suggestedList.innerText = "";
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

/**
 * Clear de search box
 */
function searchReset() {
  suggestedList.innerText = "";
  inputSearch.value = "";
  isSearchingState(false);
};

/**
 * Control the results button
 */
function searchVerMas() {
  const { search } = GiphyApi;

  search(inputSearch.value, pageItems, pageOffset + pageItems)
    .then((response) => {
      pageOffset = response.pagination.offset;
      pageTotalCount = response.pagination.total_count;
      pageCount = pageTotalCount - (response.pagination.count + pageOffset);

      if (pageCount < 1) {
        btnVerMas.style.display = "none";
      } else {
        btnVerMas.style.display = "inline";
      };

      response.data.forEach((element) => {
        createCard(element.images.original.url);
      })
    }).catch((error) => {
      resultsCards.innerText = "Error " + error;
    });
};

/**
 * Events
 */

window.addEventListener("load", onLoad);

inputSearch.addEventListener("keyup", getAutocompleteSearch);
inputX.addEventListener("click", searchReset);

suggestedList.addEventListener("click", onSuggestedItemClicked);

btnVerMas.addEventListener("click", searchVerMas);
