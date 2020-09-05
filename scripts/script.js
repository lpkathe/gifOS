import GiphyApi from './GiphyApi.js';

/**
 * Global variables
 */
const trendingContainer = document.querySelector(".trending__container");
const trendingSlide = document.querySelector(".trending__slide");

const buttonLeft = document.querySelector(".button__left");
const buttonRight = document.querySelector(".button__right");

const favoriteList = window.localStorage;

/**
 * Clone card's slide.
 */
function trendingCards() {
  const { trendingGifs } = GiphyApi;
  
  trendingGifs()
  .then((response) => {
    response.data.forEach((element, index) => {
      const clonedTrendingSlide = trendingSlide.cloneNode(true);
      trendingContainer.appendChild(clonedTrendingSlide);
      clonedTrendingSlide.style.display = "inline-block";
      
      clonedTrendingSlide.setAttribute("id", element.id);
      
      const clonedCard = clonedTrendingSlide.querySelector(".trending__card");
      clonedCard.src = element.images.original.url;
      
      clonedTrendingSlide.querySelector(".trending__hover__user").innerHTML = element.username;
      clonedTrendingSlide.querySelector(".trending__hover__title").innerHTML = element.title;
      
      if (screen.width > 1023) {
        const position = (clonedCard.width * index);
        clonedTrendingSlide.style.left = `${position}px`;
        clonedTrendingSlide.style.marginRight = "29px";
      }
    });
  });
};

/**
 * Events
 */

buttonRight.addEventListener("click",function() {
  document.querySelector(".trending__container").scrollLeft += 350;
});
buttonLeft.addEventListener("click",function() {
  document.querySelector(".trending__container").scrollLeft -= 350;
});

export default favoriteList;