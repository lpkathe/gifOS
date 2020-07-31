import GiphyApi from './GiphyApi.js'

/**
 * Global variables
 */
const inputSearch = document.getElementById("inputSearch");
const iconSearchLight = document.getElementById("iconSearchLight");
const iconSearchDark = document.getElementById("iconSearchDark");
const gifContainer = document.getElementById("gifContainer");
const pTrending = document.querySelector(".section__trending__p");
const suggested_search = document.getElementById("suggested_search");

/**
 * Functions that load with the page.
 */
function onLoad() {
    getTrendingCategories();
}

/**
 * Get gifs of the search results and display then on html
 */
function search() {
    const { search } = GiphyApi;
    
    search(inputSearch.value)
    .then((response) => {
        response.data.forEach((element) => {
            createImage(element.images.original.url, element.title);
        })
    }) .catch ((error) => {
        gifContainer.innerHTML = "Error "+ error;
    });
}

/**
 * Create cards for results
 * @param {} url 
 * @param {*} title 
 */
function createImage(url, title) {
    const image = document.createElement("img");
    const p = document.createElement("p");
    
    gifContainer.appendChild(image);
    gifContainer.appendChild(p);
    
    p.innerText = title;
    image.src = url;
    image.alt = title;
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
        pTrending.innerText = list.join(', ');
    }) .catch ((error) => {
        pTrending.innerText = "Error "+ error;
    });
};

/**
 * Suggestion search
 */
function getAutocompleteSearch() {
    const { autocompleteSearch } = GiphyApi;

    suggested_search.innerText = "";

    autocompleteSearch(inputSearch.value)
    .then((response) => {
        response.data.forEach((element) => {
            const option = document.createElement('option');
            option.value = element.name;
            suggested_search.appendChild(option);
        });
    });
};

/**
 * Events
 */

inputSearch.addEventListener("keypress", getAutocompleteSearch);

iconSearchLight.addEventListener("click", search);
iconSearchDark.addEventListener("click", search);
window.addEventListener("load", onLoad);

const carouselIndex = 0;
showCarousel();

function showCarousel() {
       const card;
       const slides = document.getElementsByClassName("carousel");

       for (card = 0; card < slides.length; card++) {
            slides[card].style.display = "none";
       }
       carouselIndex++;
    
       if (carouselIndex > slides.length) {
           carouselIndex = 1}

       slides[carouselIndex-1].style.display = "block";
       setTimeout(showSlides,2000);
};