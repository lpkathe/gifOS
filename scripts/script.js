import GiphyApi from './GiphyApi.js'

/**
 * Variables globales
 */
const inputSearch = document.getElementById("inputSearch");
const iconSearchLight = document.getElementById("iconSearchLight");
const iconSearchDark = document.getElementById("iconSearchDark");
const gifContainer = document.getElementById("gifContainer");
const pTrending = document.querySelector('.section__trending__p');


/**
 * Funciones que cargan junto con la página
 */
function onLoad() {
    getTrendings();
}

/**
 * Trae los gifs de la búsqueda y los pinta en el html
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
 * Crea las cards donde irán los gifs resultado de las búsquedas
 * @param {} url 
 * @param {*} title 
 */
function createImage(url, title) {
    const imagen = document.createElement("img");
    const p = document.createElement("p");
    
    gifContainer.appendChild(imagen);
    gifContainer.appendChild(p);
    
    p.innerHTML = title;
    imagen.src = url;
    imagen.alt = title;
};

/**
 * Trae los títulos de los gifs que son tendencia
 */
function getTrendings() {
    const { trending } = GiphyApi;
    let lista = [];
    
    trending()
    .then((response) => {
        response.data.forEach((element) => {
            lista.push(element.title);
        });
        pTrending.innerHTML = lista.join(', ');
    }) .catch ((error) => {
        pTrending.innerHTML = "Error "+ error;
    });
};

/**
 * Eventos
 */

inputSearch.addEventListener("keypress", function (enterkey) {
    if (enterkey.keyCode === 13) {
    }
    console.log(enterkey);
}, false);

iconSearchLight.addEventListener("click", search);
iconSearchDark.addEventListener("click", search);
window.addEventListener("load", onLoad);
