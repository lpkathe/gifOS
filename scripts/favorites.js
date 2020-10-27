import GiphyApi from "./GiphyApi.js";

/**
 * Global variables.
 */

let favoriteList = ["dWSsGiOWHbcHVrOh5f", "H6EoEqUOsMfi0xcKzC"];

/**
 * Functions that load with the page.
 */
function onLoad() {
  const {gifById} = GiphyApi;

  favoriteList = JSON.parse(localStorage.getItem("favoriteList").split(','));

  favoriteList.forEach((id, index) => {
    if(id !== "") {
      gifById(id).then((response) => {
        createCard(response, index);
      }).catch((error) => {
        console.log(error);
      });
    }
  });
};

/**
 * Create gifs cards and hover cards with options.
 * @param {*} element.json
 */
function createCard(response, index) {
  const clonedCard = card.cloneNode(true);
  container.appendChild(clonedCard);
  
  clonedCard.style.display = "inline";
  clonedCard.setAttribute("id", response.data.id);
  
  const clonedGif = clonedCard.querySelector(".gif");
  clonedGif.src = response.data.images.original.url;
  
  clonedCard.querySelector(".hover__user").innerText = response.data.username;
  clonedCard.querySelector(".hover__title").innerText = response.data.title;
  clonedCard.querySelector(".favoriteButton").addEventListener("click", toggleFavorite);

  if (screen.width < 1023) {
    const position = (clonedGif.width * index);
    clonedCard.style.left = `${position}px`;
    clonedCard.style.marginRight = "29px";
  };
};

/**
 * Add or erase element to favorites list.
 * @param {*} event 
 */
function toggleFavorite(event) {

  const card = event.toElement.parentElement.parentElement.parentElement.parentElement;
  const id = card.id;

  if(id !== "") {
    if (id in favoriteList) {
      favoriteList.remove(id);

      favoriteOption.style.background = "transparent";

      container.removeChild(card);
    } else {
      favoriteList.push(id);
    }
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    console.log("saving:" + JSON.parse(localStorage.getItem("favoriteList")));
  }
};

window.addEventListener("load", onLoad);
favoriteButton.addEventListener("click", toggleFavorite);