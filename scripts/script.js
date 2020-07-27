import GiphyApi from './GiphyApi.js'

const inputSearch = document.getElementById("inputSearch");
const iconSearchLight = document.getElementById("iconSearchLight");
const iconSearchDark = document.getElementById("iconSearchDark");
const gifContainer = document.getElementById("gifContainer");

inputSearch.addEventListener("keypress", function (enterkey) {
    if (enterkey.keyCode === 13) {
    }
    console.log(e);
}, false);

iconSearchLight.addEventListener("click", search);
iconSearchDark.addEventListener("click", search);

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

function createImage(url, title) {
    const imagen = document.createElement("img");
    const p = document.createElement("p");

    gifContainer.appendChild(imagen);
    gifContainer.appendChild(p);

    p.innerHTML = title;
    imagen.src = url;
    imagen.alt = title;
}