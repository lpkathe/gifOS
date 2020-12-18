import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const pageLogo = document.getElementById("pageLogo");
const logo = document.querySelector(".nav-bar__logo");

const inputDarkMode = document.getElementById("dark-mode");
const textDarkMode = document.getElementById("textDarkMode");

const favoriteMenu = document.getElementById("favoriteMenu");
const favoritesGroup = document.querySelector(".favorites__group");
const favoritesContainer = document.getElementById("favoritesContainer");
const favoritesEmpty = document.querySelector(".favorites__empty");

const main = document.querySelector(".main");
const btnMas = document.querySelector(".navigation__mas");

const maximizedContainer = document.querySelector(".maximized__container");
const maximizedPicture = document.querySelector(".maximized__picture");
const maximizedCardContainer = document.querySelector(".maximized__card__container");
const btnLeftMaximized = document.querySelector(".maximizedButtonLeft");
const btnRightMaximized = document.querySelector(".maximizedButtonRight");

const header = document.querySelector(".header");
const headerPicture = document.querySelector(".search__picture");

const searchGroup = document.querySelector(".search__group");
const searchBox = document.querySelector(".search__box");
const inputX = document.querySelector(".search__box__x");
const inputSearch = document.getElementById("inputSearch");
const inputSearchRightIcon = document.querySelector(".search__box__icon");
const inputSearchLeftIcon = document.querySelector(".search__box__icon-list");
const suggestedList = document.querySelector(".search__box__list");

const pTrendingCategories = document.querySelector(".search__p");

const resultsContainer = document.querySelector(".results__container");
const resultsTitle = document.querySelector(".results__title");
const resultsCardsContainer = document.getElementById("resultsCardsContainer");

const myGifosMenu = document.getElementById("myGifosMenu");
const myGifosGroup = document.querySelector(".myGifos__group");
const myGifosEmpty = document.querySelector(".myGifos__empty");
const myGifosContainer = document.getElementById("myGifosContainer");

const trendingContainer = document.getElementById("trendingContainer");
const width = trendingContainer.clientWidth;
const buttonRight = document.querySelector(".buttonRight");
const buttonLeft = document.querySelector(".buttonLeft");
const card = document.querySelector(".card");
let cardsCount = 0;
let cardsCountScroll = 0;
let listTrendingCards = [];

const btnVerMas = document.getElementById("resultsButton");
const btnVerMasFavorites = document.getElementById("favoritesButton");
const btnVerMasMyGifos = document.getElementById("myGifosButton");

const downloadButton = document.querySelector(".downloadButton");

let favoriteList = [];
let favoritesPageCount = 0;
let favoritesTotalPages = 0;


let pageOffset = 0;
let pageCount = 1;
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
  darkMode();

  if (window.screen.width < 1023) {
    trendingContainer.addEventListener('scroll', scrollTrendingSectionMobile);
  }
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
 * Change text in navigation bar and logo colors when input dark mode shift
 */
function darkMode() {
  if (inputDarkMode.checked) {
    pageLogo.src = "assets/logo-mobile-modo-noct.svg";
    textDarkMode.innerText = "Modo Diurno";
    inputSearch.style.color = "white";
  } else {
    pageLogo.src = "assets/logo-mobile.svg";
    textDarkMode.innerText = "Modo Nocturno";
    inputSearchRightIcon.className = "search__box__icon icon-icon-search";
    inputSearch.style.color = "black";
  }
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
    clonedCard.querySelector(".gif").src = element.images.original.url;
    clonedCard.querySelector(".trending__user").innerHTML = element.username;
    clonedCard.querySelector(".trending__title").innerHTML = element.title;

    assignListeners(clonedCard);

    if (container.id !== "trendingContainer") {
      fixItemsInCards(clonedCard, "normal", container);
    }

    if (favoriteList.includes(element.id)) {
      const favoriteOption = clonedCard.querySelector(".favoriteOption");
      favoriteOption.className = "options favoriteOption icon-icon-fav-active";
    }

    const position = (clonedCard.width * index);
    if (screen.width < 1023) {
      clonedCard.style.left = `${position}px`;
      clonedCard.addEventListener("click", maximizedView);
    } else {
      clonedCard.style.left = `${position + 27}px`;
    }
  });
};

/**
 * Define origin container of cards.
 * @param {type of card it will become} typeCard 
 * @param {Card container} originContainer
 */
function clarifyOrigin(typeCard, originContainer) {
  let origin = "maximized";

  if (originContainer.className === "card trending__card" || originContainer.className === "results__cards") {
    origin = "trending";
  }
  if (originContainer.className === "card normal__card") {
    origin = "normal";
  }
  return (origin);
};

/**
 * Fix the items in the correct positions into card.
 */
function fixItemsInCards(clonedCard, typeCard, originContainer) {
  const origin = clarifyOrigin(typeCard, originContainer);

  clonedCard.querySelector(".favoriteButton").className = typeCard + "__button favoriteButton";
  clonedCard.querySelector(".downloadButton").className = typeCard + "__button downloadButton";
  clonedCard.querySelector(".maximizedButton").className = typeCard + "__button maximizedButton";

  renameClases(clonedCard, typeCard, origin);

  if (typeCard === "maximized") {
    const downloadIcon = clonedCard.querySelector(".icon-icon-download");
    downloadIcon.style.fontSize = "18px";
    downloadIcon.style.backgroundColor = "transparent";

    const favoriteOption = clonedCard.querySelector(".favoriteOption");
    favoriteOption.style.fontSize = "18px";
    favoriteOption.style.backgroundColor = "transparent";

    clonedCard.querySelector(`.hover`).className = `maximized__hover`;
    clonedCard.querySelector(".maximizedButton").style.display = "none";

    let clonedCardGif = clonedCard.querySelector(".gif");
    clonedCardGif.style.position = "static";
    clonedCardGif.style.cursor = "unset";
  }

  if (origin !== "maximized") {
    const text = clonedCard.querySelectorAll('p');
    text.forEach((element) => element.style.color = "black");
  }
  clonedCard.className = `card ${typeCard}__card`;
};

/**
 * Change the class name of some elements of the cloned card.
 * @param {card container} origin 
 * @param {type of card it will become} typeCard 
 * @param {clon to original card} clonedCard 
 */
function renameClases(clonedCard, typeCard, origin) {
  clonedCard.querySelector(`.${origin}__user`).className = `${typeCard}__user`;
  clonedCard.querySelector(`.${origin}__title`).className = `${typeCard}__title`;
  clonedCard.querySelector(`.${origin}__buttons`).className = `${typeCard}__buttons`;
};

/**
 * Assing the listeners in buttons for the clone cards.
 * @param {*} clonedCard 
 */
function assignListeners(clonedCard) {
  clonedCard.querySelector(".favoriteButton").addEventListener("click", toggleFavorite);
  clonedCard.querySelector(".downloadButton").addEventListener("click", downloadGif);
  clonedCard.querySelector(".maximizedButton").addEventListener("click", maximizedView);
  buttonLeft.addEventListener("click", scrollLeftTrendingSection);
  buttonRight.addEventListener("click", moreTrendingCards);
  btnRightMaximized.addEventListener("click", slideTrendingCards);
  btnLeftMaximized.addEventListener("click", slideTrendingCards);
};

/**
 * Clone card's slide.
 */
function trendingCards() {
  const { trendingGifs } = GiphyApi;
  const offset = cardsCount * 5;

  trendingGifs(5, offset)
    .catch(error => console.log(error))
    .then((response) => {
      if (cardsCount <= 5) {
        createCards(response.data, trendingContainer);
        const list = response.data.forEach((element) => {
          listTrendingCards.push(element.id);
        });
        cardsCount++;
      }
    });
};

/**
 * Get more trending cards.
 * @param {click} event 
 */
function moreTrendingCards() {
  trendingCards();
  scrollRightTrendingSection();
};

/**
 * Defines the amount of pixels that move for each press of the button.
 */
function scrollRightTrendingSection() {
  const scrollRight = trendingContainer.scrollWidth;
  const scrollCount = trendingContainer.offsetLeft;

  if (scrollRight > scrollCount) {
    trendingContainer.scrollLeft += width;
  }
};

/**
 * Defines the amount of pixels that move for each press of the button.
 */
function scrollLeftTrendingSection() {
  trendingContainer.scrollLeft -= width;
};

/**
 * Use the scroll for show more trending cards in the mobile style.
 * @param {scroll} event 
 */
function scrollTrendingSectionMobile(event) {
  const defaultSpace = 940;
  const scrollCounter = defaultSpace * cardsCountScroll;

  if (trendingContainer.scrollLeft >= scrollCounter && cardsCountScroll <= 5) {
    trendingCards()
    cardsCountScroll += 1;
  }
};

function downloadBlob(blob, filename) {
  const downloadAncor = document.createElement('a');
  downloadButton.appendChild(downloadAncor);
  downloadAncor.download = filename;
  downloadAncor.href = blob;
  downloadAncor.click();
  downloadAncor.remove();
};

function downloadGif(event) {
  const targetCard = event.target.closest("div").parentElement.parentElement;

  const url = targetCard.querySelector(".gif").src;
  const filename = url.split('\\').pop().split('/').pop();

  fetch(url, {
    headers: new Headers({ 'Origin': location.origin }),
    mode: 'cors'
  })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      downloadBlob(blobUrl, filename);
    })
    .catch(e => console.error(e));
};

// MAXIMIZED VIEW CARD SECTION

/**
 * Activate the container for a larger view
 * @param {} event 
 */
function maximizedView(event) {
  const targetCard = selecMainCard(event);
  const clonedCard = targetCard.cloneNode(true);

  maximizedCardContainer.appendChild(clonedCard);
  maximizedContainer.style.display = "block";
  window.scrollTo(0, 0);

  fixItemsInCards(clonedCard, "maximized", targetCard);
  assignListeners(clonedCard);
};

/**
 * Selec the main card to work.
 * @param {} event 
 */
function selecMainCard(event) {
  ;
  let targetCard;

  if (window.screen.width < 1023) {
    targetCard = event.target.closest("div");
  } else {
    targetCard = event.target.closest("div").parentElement.parentElement;
  }
  return (targetCard);
};

/**
 * Close the larger view
 */
function maximizedViewClose() {
  maximizedContainer.style.display = "none";
  maximizedCardContainer.innerHTML = "";
};

/**
 * Trending cards navigation in maximized view.
 * @param {click} event 
 */
function slideTrendingCards(event) {
  const side = event.target.closest("button");
  const cardContainer = event.target.closest("div");
  const actuallyCard = cardContainer.querySelector(".maximized__card").id;
  const selectecCard = listTrendingCards.indexOf(actuallyCard);
  let nextCard;

  btnRightMaximized.style.display = "block";
  btnLeftMaximized.style.display = "block";

  if (side == btnRightMaximized) {
    nextCard = listTrendingCards[selectecCard + 1];
    if (listTrendingCards.length === selectecCard + 1) {
      btnRightMaximized.style.display = "none";
    }
  } else {
    nextCard = listTrendingCards[selectecCard - 1];
    if (selectecCard == 0) {
      btnLeftMaximized.style.display = "none";
    }
  }

    if (nextCard != null) {
      maximizedCardContainer.innerHTML = "";
      const existingCard = document.getElementById(nextCard);
      const clonedCard = existingCard.cloneNode(true);
      maximizedCardContainer.appendChild(clonedCard);

      fixItemsInCards(clonedCard, "maximized", existingCard);
      assignListeners(clonedCard);
    }
  };

  // FAVORITES SECTION

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
   * Get favorites gifs to API and calculate pages to show.
   */
  function favoritesVerMas() {
    const sliceStartPos = favoritesPageCount * pageItems;
    const paginatedList = favoriteList.slice(sliceStartPos, sliceStartPos + pageItems);

    if (paginatedList.length > 0) {
      gifsById(paginatedList.join(","))
        .catch(error => console.log(error))
        .then((response) => {
          if (favoritesPageCount != favoritesTotalPages) {
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
        fixItemsInCards(clonedCard, "normal", targetCard);
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

  /**
   * Change de classname to heart icon.
   * @param {Card} targetCard 
   * @param {*} action 
   */
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
          resultsCardsContainer.style.display = "none";
        }

        createCards(response.data, resultsCardsContainer);
      }).catch((error) => {
        resultsCardsContainer.innerText = "Error " + error;
      });

    isSearchingState(false);
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

      if (myGifosContainer != "") {
        favoritesGroup.style.display = "none";
      }
    }
    //loadMyGifos(); incluir version
    //favoritesVerMas(); incluir version
  };

  /**
   * Events
   */

  logo.addEventListener("click", function () {
    location.reload();
  });
  inputDarkMode.addEventListener("change", darkMode);
  favoriteMenu.addEventListener("click", goToFavorites);

  window.addEventListener("load", onLoad);

  maximizedPicture.addEventListener("click", maximizedViewClose);

  inputSearch.addEventListener("keyup", getAutocompleteSearch);
  inputX.addEventListener("click", searchReset);
  inputSearchLeftIcon.addEventListener("click", search);

  suggestedList.addEventListener("click", onSuggestedItemClicked);

  btnVerMas.addEventListener("click", searchVerMas);
  btnVerMasFavorites.addEventListener("click", favoritesVerMas);

  myGifosMenu.addEventListener("click", goToMyGifos);