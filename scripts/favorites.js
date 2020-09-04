import { GiphyApi } from "./GiphyApi";
import favoriteList, { favoritesList } from "./script";

/**
 * Global variables.
 */
const container = document.querySelector(".container");
const favoriteOption = document.querySelector(".favoriteOption");

const { favoritesList } = script;
const { gifById } = GiphyApi

/**
 * Functions that load with the page.
 */
function onload() {
  favoriteList.forEach(element => {
    gifById(element)((response) => {
      createCard(response);
    }).catch((error) => {
      console.log(error);
    });
  };

  /**
   * Create gifs cards and hover cards with options.
   * @param {*} element 
   */
  function createCard(element) {
    const clonedCard = Card.cloneNode(true);
    container.appendChild(clonedCard);

    clonedCard.setAttribute("id", element.id);

    const clonedGif = clonedCard.querySelector(".gif");
    clonedGif.src = element.images.original.url;

    clonedCard.querySelector(".hover__user").innerHTML = element.username;
    clonedCard.querySelector(".hover__title").innerHTML = element.title;

    if (screen.width > 1023) {
      const position = (clonedGif.width * index);
      clonedCard.style.left = `${position}px`;
      clonedCard.style.marginRight = "29px";
    }
  };

  /**
   * Add or erase element to favorites list.
   * @param {*} event 
   */
  function addFavorites(event) {
    console.log(event);
    const id = card.id;

    if (id in favoritesList) {
      localStorage.removeItem(card.id);
      favoritesList.remove(card.id);

      favoriteOption.style.background = "transparent";

      id.getElementById(card.id);
      container.removeChild(id);
    } else {
      localStorage.setItem(card.id);
      favoritesList.push(card).id;
      createCard();
    };
  };

  window.addEventListener("load", onload);
  favoriteButton.addEventListener("click", addFavorites);