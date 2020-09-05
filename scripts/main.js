import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const slideContainer = document.querySelector(".slide__container");
const Container = document.querySelector(".container");
const buttonRight = document.querySelector(".buttonRight");
const buttonLeft = document.querySelector(".buttonLeft");

/**
 * Clone card's slide.
 */
function trendingCards() {
  const { trendingGifs } = GiphyApi;

  trendingGifs()
    .then((response) => {
      response.data.forEach((element, index) => {
        const clonedContainer = Container.cloneNode(true);
        slideContainer.appendChild(clonedContainer);
        clonedContainer.style.display = "inline-block";

        clonedContainer.setAttribute("id", element.id);

        const clonedCard = clonedContainer.querySelector(".card");
        clonedCard.src = element.images.original.url;

        clonedContainer.querySelector(".hover__user").innerHTML = element.username;
        clonedContainer.querySelector(".hover__title").innerHTML = element.title;

        if (screen.width > 1023) {
          const position = (clonedCard.width * index);
          clonedContainer.style.left = `${position}px`;
          clonedContainer.style.marginRight = "29px";
        }
      });
    });
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