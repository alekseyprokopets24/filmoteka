'use strict';

const jsScrollBtn = document.querySelector('#js-scroll-btn');

const jsList = document.querySelector('#js-list');
let renderFilms;
let pageNumber = 1;
let ganre;
jsScrollBtn.addEventListener('click', scrollTop);
function scrollTop(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}


let selectFilm = {};



function fetchPopularMoviesList() {
    fetch('https://api.themoviedb.org/3/movie/popular?api_key=8498946f9c7874ef33ac19a931c494c9&language=en-US&page=' + `${pageNumber}`)
        .then(response => {
            if (response.ok) return response.json();

            throw new Error(`Error while fetching: ${response.statusText}`);
        })
        .then(data => {
            

            let result = data.results;

            result.forEach(el => {
                if (el.backdrop_path !== null) {
                    createCardFunc(el.backdrop_path, el.title, el.id);
                  } else if(el.poster_path !== null)  {
                    createCardFunc(el.poster_path, el.title, el.id);
                  } else {
                    createCardFunc('logo', el.title, el.id);
                  }


            });



        })
        .catch(error => console.log(error));
}

function createCardFunc(imgPath, filmTitle, movieId) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const p = document.createElement('p');

    if(imgPath == 'logo') {
        img.setAttribute('src', './images/logo.png');
    } else {
        img.setAttribute('src', `https://image.tmdb.org/t/p/w500` + `${imgPath}`);
    }

    li.setAttribute('js-id', `${movieId}`);

    p.textContent = `${filmTitle}`;
    li.append(img);
    li.append(p);
    jsList.append(li);
    img.classList.add('homePage__img');
    li.classList.add('homePage__items');
    p.classList.add('homePage__text');
    
    
}