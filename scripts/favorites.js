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