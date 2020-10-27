import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const resultsCardsContainer = document.getElementById("resultsCardsContainer");
const resultsContainer = document.querySelector(".results__container");
const favoritesContainer = document.getElementById("favoritesContainer");
const trendingContainer = document.getElementById("trendingContainer");
const card = document.querySelector(".card");
const buttonRight = document.querySelector(".buttonRight");
const buttonLeft = document.querySelector(".buttonLeft");
const favoriteButton = document.querySelector(".favoriteButton");
const btnMas = document.querySelector(".navigation__mas");

const searchBox = document.querySelector(".search__box");
const inputX = document.querySelector(".search__box__x");
const inputSearchRightIcon = document.querySelector(".search__box__icon");
const inputSearchLeftIcon = document.querySelector(".search__box__icon-list");

const suggestedList = document.querySelector(".search__box__list");
const pTrendingCategories = document.querySelector(".search__p");

const resultsTitle = document.querySelector(".results__title");

const inputSearch = document.getElementById("inputSearch");
const btnVerMas = document.querySelector(".results__button");

let pageOffset = 0;
let pageCount = 0;
let pageTotalCount = 0;
const pageItems = 12;

let favoriteList = ["dWSsGiOWHbcHVrOh5f", "H6EoEqUOsMfi0xcKzC"];

/**
 * Load different modules.
 */
function onLoad() {
  getTrendingCategories();
  trendingCards();
};

/**
 * Create cards
 * @param {object} response.data
 * @param {object} div container
 */
function createCards(data, container) {
  data.forEach((element, index) => {
    const clonedCard = card.cloneNode(true);
    container.appendChild(clonedCard);
    clonedCard.style.display = "inline-block";
    
    clonedCard.setAttribute("id", element.id);
    
    const clonedGif = clonedCard.querySelector(".gif");
    clonedGif.src = element.images.original.url;

    clonedCard.querySelector(".hover__user").innerHTML = element.username;
    clonedCard.querySelector(".hover__title").innerHTML = element.title;
    clonedCard.querySelector(".favoriteButton").addEventListener("click", toggleFavorite);
    
    if (container !== trendingContainer) {
      clonedCard.classList.add("results__card");
    }

    if (screen.width < 1023) {
      const position = (clonedCard.width * index);
      clonedCard.style.left = `${position}px`;
      clonedCard.style.marginRight = "29px";
    } 
  });
};

/**
 * Clone card's slide.
 */
function trendingCards() {
  const { trendingGifs } = GiphyApi;

  trendingGifs()
    .catch(error => console.log(error))
    .then((response) => createCards(response.data, trendingContainer));
};

/**
 * Add or erase element to favorites list.
 * @param {*} event 
 */
function toggleFavorite(event) {
  console.log(event);
  const card = event.toElement.parentElement.parentElement.parentElement.parentElement;
  const id = card.id;

  if (id !== "") {
    if (id in favoriteList) {
      favoriteList.remove(id);

      favoriteOption.style.background = "transparent";

      trendingCremoveChild(card);
    } else {
      favoriteList.push(id);
      favoriteOption.style.background = "#572EE5";
    };
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    console.log("saving:" + JSON.parse(localStorage.getItem("favoriteList")));
  }
};

/* 

function scrollWindow(event) {

  const scrollPercentage = (window.pageYOffset * 100) / 358;
  const searchBoxScrollPosition = screen.width / 5;

  if (window.pageYOffset > 358) {
    searchBox.style.position = "fixed";
    searchBox.style.top = "25px";
    searchBox.style.left = `${searchBoxScrollPosition}px`;
  } else {
    searchBox.style.position = "static";
    searchBox.style.width = "551px";
    searchBox.style.top = "19px";
    searchBox.style.left = "auto";
  };

  if (scrollPercentage <= 100 && scrollPercentage >= 0) {
    searchBox.style.width = 551 - ((scrollPercentage * 217) / 100) + "px";
    btnMas.style.opacity = 1 - (scrollPercentage / 100);
  };
}; */

/**
 * Get gifs of the search results and display then on html
 */
function search() {
  const { search } = GiphyApi;

  resultsTitle.innerText = inputSearch.value;
  resultsCardsContainer.innerHTML = "";
  resultsContainer.style.display = "block";

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

      if (response.data.length === 0) {
        document.querySelector(".results__error").style.display = "inline";
      }

      createCards(response.data, resultsCardsContainer);
    }).catch((error) => {
      resultsCardsContainer.innerText = "Error " + error;
    });

  isSearchingState(false);
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
        createCards(element.images.original.url);
      })
    }).catch((error) => {
      resultsContainer.innerText = "Error " + error;
    });
};

/**
 * Events
 */
window.addEventListener("load", onLoad);
buttonRight.addEventListener("click", function () {
  document.querySelector(".trending__container").scrollLeft += 350;
});
buttonLeft.addEventListener("click", function () {
  document.querySelector(".trending__container").scrollLeft -= 350;
});
favoriteButton.addEventListener("click", toggleFavorite);

inputSearch.addEventListener("keyup", getAutocompleteSearch);
inputX.addEventListener("click", searchReset);

suggestedList.addEventListener("click", onSuggestedItemClicked);

btnVerMas.addEventListener("click", searchVerMas);