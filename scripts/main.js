import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const homepage = document.querySelector(".homepage");
const main = document.querySelector(".main");
const btnMas = document.querySelector(".navigation__mas");

const maximizedContainer = document.querySelector(".maximized__container");
const maximizedPicture = document.querySelector(".maximized__picture");
const maximizedCardContainer = document.querySelector(".maximized__card__container");

const header = document.querySelector(".header");
const headerPicture = document.querySelector(".search__picture");

const searchGroup = document.querySelector(".search__group");
const searchBox = document.querySelector(".search__box");
const inputSearch = document.getElementById("inputSearch");
const inputSearchRightIcon = document.querySelector(".search__box__icon");
const inputSearchLeftIcon = document.querySelector(".search__box__icon-list");
const suggestedList = document.querySelector(".search__box__list");

const pTrendingCategories = document.querySelector(".search__p");

const resultsContainer = document.querySelector(".results__container");
const resultsTitle = document.querySelector(".results__title");
const resultsCardsContainer = document.getElementById("resultsCardsContainer");

const favoriteMenu = document.getElementById("favoriteMenu");
const favoritesGroup = document.querySelector(".favorites__group");
const favoritesContainer = document.getElementById("favoritesContainer");
const favoritesEmpty = document.querySelector(".favorites__empty");

const myGifosMenu = document.getElementById("myGifosMenu");
const myGifosGroup = document.querySelector(".myGifos__group");

const trendingContainer = document.getElementById("trendingContainer");
const buttonRight = document.querySelector(".buttonRight");
const buttonLeft = document.querySelector(".buttonLeft");
const card = document.querySelector(".card");

const btnVerMas = document.getElementById("resultsButton");
const btnVerMasFavorites = document.getElementById("favoritesButton");
const btnVerMasMyGifos = document.getElementById("myGifosButton");

const downloadButton = document.querySelector(".downloadButton");
const downloadA = document.querySelector(".downloadA");

let favoriteList = [];
let favoritesPageCount = 0;
let favoritesTotalPages = 0;

let pageOffset = 0;
let pageCount = 0;
let pageTotalCount = 0;

const pageItems = 12;

const { gifsById } = GiphyApi;

/**
 * Load different modules.
 */
function onLoad() {
  getTrendingCategories();
  trendingCards();
  loadFavorites();
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
    
    clonedCard.style.display = "inline";
    clonedCard.setAttribute("id", element.id);
    clonedCard.querySelector(".trending__user").innerHTML = element.username;
    clonedCard.querySelector(".trending__title").innerHTML = element.title;

    const clonedGif = clonedCard.querySelector(".gif");
    clonedGif.src = element.images.original.url;

    downloadButton.addEventListener("click", downloadImage(clonedGif));

    const favoriteButton = clonedCard.querySelector(".favoriteButton");
    favoriteButton.addEventListener("click", toggleFavorite);
    const maximizedFavoritesButton = clonedCard.querySelector(".maximizedButton");
    maximizedFavoritesButton.addEventListener("click", maximizedView);

    if (container.id !== "trendingContainer") {
      fixItemsInCards(clonedCard, "normal");
    }

    if (favoriteList.includes(element.id)) {
      const favoriteOption = clonedCard.querySelector(".favoriteOption");
      favoriteOption.className = "options favoriteOption icon-icon-fav-active";
    }

    if (screen.width < 1023) {
      const position = (clonedCard.width * index);
      clonedCard.style.left = `${position}px`;
    }
  });
};

/**
 * Fix the items in the correct positions into card.
 */
function fixItemsInCards(clonedCard, typeCard) {
  clonedCard.querySelector(".favoriteButton").className = `${typeCard}__button favoriteButton`;
  clonedCard.querySelector(".downloadButton").className = `${typeCard}__button downloadButton`;

  if (clonedCard.className !== "card maximized__card") {
    clonedCard.querySelector(".maximizedButton").className = `${typeCard}__button maximizedButton`;
  }

  if (clonedCard.className === "card trending__card") {
    clonedCard.querySelector(".trending__user").className = `${typeCard}__u`;
    clonedCard.querySelector(".trending__title").className = `${typeCard}__t`;
    clonedCard.querySelector(".trending__buttons").className = `${typeCard}__buttons`;
  }

  if (clonedCard.className === "card normal__card") {
    clonedCard.querySelector(".normal__user").className = `${typeCard}__u`;
    clonedCard.querySelector(".normal__title").className = `${typeCard}__t`;
    clonedCard.querySelector(".normal__buttons").className = `${typeCard}__buttons`;
  }

  if (typeCard === "normal") {
    let options = clonedCard.querySelectorAll('options');
    options.forEach((element) => element.style.fontSize = "10px");
  }

  if (typeCard === "maximized") {
    clonedCard.querySelector(".icon-icon-download").style.fontSize = "18px";
    clonedCard.querySelector(".icon-icon-download").style.backgroundColor = "transparent";
    clonedCard.querySelector(".favoriteOption").style.fontSize = "18px";
    clonedCard.querySelector(".favoriteOption").style.backgroundColor = "transparent";
  }
  clonedCard.className = `card ${typeCard}__card`;
};

function downloadImage (clonedGif) {
  downloadA.setAttribute("href", "api.giphy.com/v1/gifs/search	");
  downloadA.setAttribute("download", "");
}

/**
 * Clone card's slide.
 */
function trendingCards() {
  const { trendingGifs } = GiphyApi;

  trendingGifs()
    .catch(error => console.log(error))
    .then((response) => createCards(response.data, trendingContainer));
};

// MAXIMIZED VIEW CARD SECTION

/**
 * Activate the container for a larger view
 * @param {} event 
 */
function maximizedView(event) {
  const targetCard = event.target.closest("div").parentElement.parentElement;
  const clonedCard = targetCard.cloneNode(true);
  maximizedCardContainer.appendChild(clonedCard);
  maximizedContainer.style.display = "block"

  clonedCard.querySelector(".hover").className = "maximized__hover";
  clonedCard.querySelector(".favoriteButton").addEventListener("click", toggleFavorite);

  const clonedCardGif = clonedCard.querySelector(".gif");
  clonedCardGif.style.position = "static";
  clonedCardGif.style.cursor = "unset";

  fixItemsInCards(clonedCard, "maximized");

  const maximizedButtons = clonedCard.querySelector(".maximized__buttons");
  const maximizedViewButton = clonedCard.querySelector(".maximizedButton");
  maximizedButtons.removeChild(maximizedViewButton);
}

/**
 * Close the larger view
 */
function maximizedViewClose() {
  maximizedContainer.style.display = "none";
  maximizedCardContainer.innerHTML = "";
};

// FAVORITES SECTION

/**
 * Show and hide containers and execute the load and display favorites.
 */
function goToFavorites() {
  if (favoritesGroup.style.display !== "block") {
    favoritesGroup.style.display = "block";
    searchGroup.style.display = "none";
    myGifosGroup.style.display = "none";
    loadFavorites();
    favoritesVerMas();
  }
};

/**
 * Load the favorite's list
 */
function loadFavorites() {
  const items = localStorage.getItem("favoriteList");
  favoritesTotalPages = 0;

  if (items != "") {
    favoriteList = items.split(',');
    favoritesEmpty.style.display = "none";
    if (favoriteList.length > 0) {
      favoritesTotalPages = Math.ceil(favoriteList.length / pageItems);
    }
  } else {
    favoritesEmpty.style.display = "block";
    btnVerMasFavorites.style.display = "none";
  }
};

/**
 * Get favorites gifs to API and calculate pages to show.
 */
function favoritesVerMas() {
  const sliceStartPos = favoritesPageCount * pageItems;
  const paginatedList = favoriteList.slice(sliceStartPos, sliceStartPos + pageItems);

  if (paginatedList.length > 0) {
    gifsById(paginatedList.join(","))
      .catch(error => console.log(error))
      .then((response) => {
        if ((favoritesPageCount + 1) != favoritesTotalPages) {
          btnVerMasFavorites.style.display = "block";
        } else {
          btnVerMasFavorites.style.display = "none";
        }
        createCards(response.data, favoritesContainer);
        favoritesPageCount += 1;
      });
  }
};

/**
 * Add or erase element to favorites list.
 * @param {*} event 
 */
function toggleFavorite(event) {
  const targetCard = event.target.closest("div").parentElement.parentElement;
  const id = targetCard.id;
  if (id !== "") {
    if (favoriteList.includes(id)) {
      favoriteList.splice(favoriteList.indexOf(id), 1);
      favoritesIcon(targetCard, "deactivate");
      removeFavoriteCard(id);
    } else {
      favoriteList.push(id);
      const clonedCard = targetCard.cloneNode(true);
      fixItemsInCards(clonedCard, "normal");
      clonedCard.querySelector(".favoriteButton").addEventListener("click", toggleFavorite);
      favoritesIcon(targetCard, "activate");

      if (favoritesGroup.style.display == "block") {
        favoritesContainer.appendChild(clonedCard);
      }
    }
    localStorage.setItem("favoriteList", favoriteList.join(","));
  }

  if (favoriteList.length == 0) {
    favoritesEmpty.style.display = "block";
  } else {
    favoritesEmpty.style.display = "none";
  }
};

function favoritesIcon(targetCard, action) {
  let card = document.querySelectorAll(".card");
  let cardClassName = "options favoriteOption icon-icon-fav-active";

  if (action === "deactivate") {
    cardClassName = "options favoriteOption icon-icon-fav-hover";
  }

  card.forEach((element) => {
    if (element.id === targetCard.id) {
      targetCard.querySelector(".favoriteOption").className = cardClassName;
    }
  });
};

/**
 * Remove a favorite card
 * @param {string} id 
 */
function removeFavoriteCard(id) {
  const favoriteCard = document.getElementById(id);

  if (favoritesContainer.contains(favoriteCard)) {
    favoritesContainer.removeChild(favoriteCard);
  }
};

// SEARCH SECTION

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
};

/**
 * Get gifs of the search results and display then on html
 */
function search() {
  const { search } = GiphyApi;

  resultsTitle.innerText = inputSearch.value;
  resultsCardsContainer.innerHTML = "";
  resultsContainer.style.display = "block";
  header.style.display = "none";
  headerPicture.style.display = "none";
  searchBox.style.marginTop = "24px";

  search(inputSearch.value, pageItems)
    .then((response) => {
      pageOffset = response.pagination.offset; // Position in pagination.
      pageTotalCount = response.pagination.total_count; // Total number of items available.
      pageCount = pageTotalCount - (response.pagination.count + pageOffset); // Total number of items returned.

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
    inputSearchRightIcon.className = "search__box__x icon-close";
    const inputX = document.querySelector(".search__box__x");
    inputX.addEventListener("click", searchReset);
    inputSearchLeftIcon.style.visibility = "visible";
  } else {
    const inputX = document.querySelector(".search__box__x");
    inputX.className = "search__box__icon icon-icon-search";
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

      createCards(response.data, resultsCardsContainer);

    }).catch((error) => {
      console.log("response");
      resultsContainer.innerText = "Error " + error;
    });
};

// MY GIFOS SECTION
/**
 * Charge My Gifos page
 * @param {*} event 
 */
function goToMyGifos(event) {
  if (myGifosGroup.style.display !== "block") {
    myGifosGroup.style.display = "block";
    searchGroup.style.display = "none";
    favoritesGroup.style.display = "none";
    btnVerMasMyGifos.style.display = "none";
  }
};

/**
 * Events
 */

window.addEventListener("load", onLoad);

homepage.addEventListener("click", function () {
  location.reload();
});

maximizedPicture.addEventListener("click", maximizedViewClose);

buttonRight.addEventListener("click", function () {
  document.querySelector(".trending__container").scrollLeft += 350;
});
buttonLeft.addEventListener("click", function () {
  document.querySelector(".trending__container").scrollLeft -= 350;
});

inputSearch.addEventListener("keyup", getAutocompleteSearch);

suggestedList.addEventListener("click", onSuggestedItemClicked);

btnVerMas.addEventListener("click", searchVerMas);
btnVerMasFavorites.addEventListener("click", favoritesVerMas);

favoriteMenu.addEventListener("click", goToFavorites);
myGifosMenu.addEventListener("click", goToMyGifos);

inputSearchLeftIcon.addEventListener("click", search);