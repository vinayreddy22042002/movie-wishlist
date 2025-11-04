
const getURL = "https://www.omdbapi.com/?i=tt3896198&apikey=3eae798c";


let favArr = JSON.parse(localStorage.getItem("movies")) || [];

document.addEventListener("DOMContentLoaded", () => {displayFav()});


function displayFav() {
    const favorites = document.getElementById("favorites");
    favorites.innerHTML = "";
    favArr.forEach((movie) => {
        const child = document.createElement("div");
        child.innerHTML =`
            <img src="${movie.Poster}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button>Remove from favorite</button>`;
        child.classList = "movie-card";

        const btn = child.querySelector("button");
        btn.addEventListener("click", () => {removeFav(movie)});

        favorites.append(child);

    })
}

function removeFav(movie) {
    favArr = favArr.filter((ele) => ele.imdbID !== movie.imdbID);
    localStorage.setItem("movies", JSON.stringify(favArr));

    displayFav();
}

function addToFav(movie) {

    if(favArr.some((ele) => ele.imdbID === movie.imdbID)) return;
    favArr.push(movie);
    localStorage.setItem("movies", JSON.stringify(favArr));

    const favorites = document.getElementById("favorites");
    const child = document.createElement("div");
    child.innerHTML =`
        <img src="${movie.Poster}">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button>Remove from favorite</button>`;
    child.classList = "movie-card";

    const btn = child.querySelector("button");
    btn.addEventListener("click", () => {removeFav(movie)});

    favorites.append(child);

}

function createMovieCard(movies) {
    const parent = document.getElementById("movieResults");
    parent.innerHTML = "";
    movies.forEach((movie) => {
        const child = document.createElement("div");
        child.innerHTML =`
            <img src="${movie.Poster}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button>Add to favorite</button>`;
        child.classList = "movie-card";

        const btn = child.querySelector("button");
        btn.addEventListener("click", () => {addToFav(movie)});
        parent.append(child);
    })
}

async function getMovie(query,page) {

    try {
        const response = await fetch(`${getURL}&s=${query}&page=${page}`);
        const data = await response.json();
        if(data.Response == "True") {
            createMovieCard(data.Search);
            // console.group(data.Search);


            const prev = document.createElement("button");
            prev.textContent = "← Prev";
            prev.classList = "buttonStyle";
            const next = document.createElement("button");
            next.textContent = "Next →";
            next.classList = "buttonStyle";

            const pages = document.getElementById("pages");
            pages.innerHTML="";
            if(page == 1) {
                pages.append(next);
            }
            else {
                pages.append(prev, next);
            }

            if(page != 1) {
                prev.addEventListener("click", () => {
                getMovie(query, --page);
                })
            }

            next.addEventListener("click", () => {
                getMovie(query, ++page);
            })
        }
        else {
            const parent = document.getElementById("movieResults");
            parent.innerHTML = `<div>Their is no movie in the name: ${query}</div>`;
        }

    }
    catch(error) {
        console.log(error);
    }
}

// getMovie("titanic");
let page = 1;
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput");
    getMovie(searchInput.value.trim(), page);
})
