import GiphyApi from './GiphyApi.js'

/**
 * Global variables
 */
const inputSearch = document.getElementById("inputSearch");
const iconSearchLight = document.getElementById("iconSearchLight");
const iconSearchDark = document.getElementById("iconSearchDark");
const gifContainer = document.getElementById("gifContainer");
const pTrending = document.querySelector('.section__trending__p');


/**
 * Functions that load with the page.
 */
function onLoad() {
    getTrendings();
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
    
    p.innerHTML = title;
    image.src = url;
    image.alt = title;
};

/**
 * Get trending titles
 */
function getTrendings() {
    const { trending } = GiphyApi;
    let list = [];
    
    trending()
    .then((response) => {
        response.data.forEach((element) => {
            list.push(element.title);
        });
        pTrending.innerText = list.join(', ');
    }) .catch ((error) => {
        pTrending.innerText = "Error "+ error;
    });
};

/**
 * Events
 */

inputSearch.addEventListener("keypress", function (enterkey) {
    if (enterkey.keyCode === 13) {
    }
    console.log(enterkey);
}, false);

iconSearchLight.addEventListener("click", search);
iconSearchDark.addEventListener("click", search);
window.addEventListener("load", onLoad);
