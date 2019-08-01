const cardLibrary = document.querySelector('.library__list');
const libraryButtonWatch = document.querySelector('.library__btn--watch');
const libraryButtonQueue = document.querySelector('.library__btn--queue');

libraryButtonWatch.addEventListener('click', drawWatchedFilmList);
libraryButtonQueue.addEventListener('click', drawQueueFilmList);


function drawWatchedFilmList() {
  libraryButtonWatch.classList.add('library__btn--active');
  libraryButtonQueue.classList.remove('library__btn--active');

  cardLibrary.innerHTML = '';
  
  const local = JSON.parse(localStorage.getItem('filmsWatched'));
 
  if (local == null || local.length === 0){
    cardLibrary.innerHTML = "<p class='text-warning'>You do not have watched movies. Add them.</p>"
  } else {

    local.forEach(el =>{
  
      if (el.backdrop_path != null ) {
        createLibraryCardFunc(el.backdrop_path, el.title, el.id, el.vote_average);
      } else {
        createLibraryCardFunc(el.poster_path, el.title, el.id, el.vote_average);
  
      }
    }
    );
  }
      
}


function drawQueueFilmList() {
  libraryButtonWatch.classList.remove('library__btn--active');
  libraryButtonQueue.classList.add('library__btn--active');
  cardLibrary.innerHTML = '';
  const local = JSON.parse(localStorage.getItem('filmsQueue'));
  if (local == null || local.length === 0){
    cardLibrary.innerHTML = "<p class='text-warning'>You do not have to queue movies to watch. Add them. </p>"
  } else {

    local.forEach(el =>{
  
      if (el.backdrop_path != null ) {
        createLibraryCardFunc(el.backdrop_path, el.title, el.id, el.vote_average);
      } else {
        createLibraryCardFunc(el.poster_path, el.title, el.id, el.vote_average);
  
      }
    }
    );
  }
      
  
}

function createLibraryCardFunc(imgPath, filmTitle, movieId, voteAverage) {
  let link;
  if (imgPath == './images/logo.png') {
    link = './images/logo.png';


  } else {
    link = `https://image.tmdb.org/t/p/w500${imgPath}`;
  }

  const liLibrary = `<li class ="library__list-item" js-id="${movieId}">
<img src="${link}"  alt="poster film">

<p class="library__vote">${voteAverage}</p>
<p class="library__nameFilm">${filmTitle}</p>
</li>`;

  cardLibrary.innerHTML += liLibrary;
}
