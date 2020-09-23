import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const container = document.querySelector(".container");
const card = document.querySelector(".card");
const buttonRight = document.querySelector(".buttonRight");
const buttonLeft = document.querySelector(".buttonLeft");
const favoriteButton = document.querySelector(".favoriteButton");

let favoriteList = ["dWSsGiOWHbcHVrOh5f", "H6EoEqUOsMfi0xcKzC"];

/**
 * Clone card's slide.
 */
function trendingCards() {
  const { trendingGifs } = GiphyApi;

  trendingGifs()
    .then((response) => {
      response.data.forEach((element, index) => {
        const clonedCard = card.cloneNode(true);
        container.appendChild(clonedCard);
        clonedCard.style.display = "inline-block";

        clonedCard.setAttribute("id", element.id);

        const clonedGif = clonedCard.querySelector(".gif");
        clonedGif.src = element.images.original.url;

        clonedCard.querySelector(".hover__user").innerHTML = element.username;
        clonedCard.querySelector(".hover__title").innerHTML = element.title;
        clonedCard.querySelector(".favoriteButton").addEventListener("click", toggleFavorite);

        if (screen.width < 1023) {
          const position = (clonedCard.width * index);
          clonedCard.style.left = `${position}px`;
          clonedCard.style.marginRight = "29px";
        }
      });
    });
};

/**
 * Add or erase element to favorites list.
 * @param {*} event 
 */
function toggleFavorite(event) {
console.log(event);
  const card = event.toElement.parentElement.parentElement.parentElement.parentElement;
  const id = card.id;

  if(id !== "") {
    if (id in favoriteList) {
      favoriteList.remove(id);

      favoriteOption.style.background = "transparent";

      container.removeChild(card);
    } else {
      favoriteList.push(id);
      favoriteOption.style.background = "#572EE5";
    };
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
    console.log("saving:" + JSON.parse(localStorage.getItem("favoriteList")));
  }
};

/**
 * Events
 */
window.addEventListener("load", trendingCards);
buttonRight.addEventListener("click", function () {
  document.querySelector(".trending__container").scrollLeft += 350;
});
buttonLeft.addEventListener("click", function () {
  document.querySelector(".trending__container").scrollLeft -= 350;
});
favoriteButton.addEventListener("click", toggleFavorite);