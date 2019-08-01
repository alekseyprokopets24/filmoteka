'use strict';

var jsScrollBtn = document.querySelector('#js-scroll-btn');
var jsList = document.querySelector('#js-list');
var renderFilms;
var pageNumber = 1;
var ganre;
jsScrollBtn.addEventListener('click', scrollTop);

function scrollTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

var selectFilm = {};

function fetchPopularMoviesList() {
  fetch('https://api.themoviedb.org/3/movie/popular?api_key=8498946f9c7874ef33ac19a931c494c9&language=en-US&page=' + "".concat(pageNumber)).then(function (response) {
    if (response.ok) return response.json();
    throw new Error("Error while fetching: ".concat(response.statusText));
  }).then(function (data) {
    var result = data.results;
    result.forEach(function (el) {
      if (el.backdrop_path !== null) {
        createCardFunc(el.backdrop_path, el.title, el.id);
      } else if (el.poster_path !== null) {
        createCardFunc(el.poster_path, el.title, el.id);
      } else {
        createCardFunc('logo', el.title, el.id);
      }
    });
  }).catch(function (error) {
    return console.log(error);
  });
}

function createCardFunc(imgPath, filmTitle, movieId) {
  var li = document.createElement('li');
  var img = document.createElement('img');
  var p = document.createElement('p');

  if (imgPath == 'logo') {
    img.setAttribute('src', './images/logo.png');
  } else {
    img.setAttribute('src', "https://image.tmdb.org/t/p/w500" + "".concat(imgPath));
  }

  li.setAttribute('js-id', "".concat(movieId));
  p.textContent = "".concat(filmTitle);
  li.append(img);
  li.append(p);
  jsList.append(li);
  img.classList.add('homePage__img');
  li.classList.add('homePage__items');
  p.classList.add('homePage__text');
}
"use strict";

var form = document.querySelector('#homePage__search');
var input = document.querySelector('#homePage__search-input');
var pagination = document.getElementById('homePage__pagination');
var prevBtn = pagination.querySelector('[data-action = "prev"]');
var nextBtn = pagination.querySelector('[data-action = "next"]');
var pageValue = pagination.querySelector('.homePage__value');
var inputValue = '';
pageValue.textContent = pageNumber;
var errorMessage = document.createElement('p');
errorMessage.setAttribute('id', 'homePage__search-error-message');
errorMessage.textContent = 'Sorry, no movie matches your request';
errorMessage.hidden = true;
form.append(errorMessage);
pagination.addEventListener('click', plaginationNavigation);

function plaginationNavigation(evt) {
  var target = evt.target;

  if (pageNumber === 2) {
    prevBtn.classList.add('hidden');
  }

  if (target === prevBtn) {
    pageNumber -= 1;
    pageValue.textContent = pageNumber;

    if (inputValue === '') {
      jsList.innerHTML = '';
      fetchPopularMoviesList();
    } else {
      fetchFilms(inputValue, pageNumber);
    }
  }

  if (target === nextBtn) {
    pageNumber += 1;
    pageValue.textContent = pageNumber;
    prevBtn.classList.remove('hidden');

    if (inputValue === '') {
      jsList.innerHTML = '';
      fetchPopularMoviesList();
    } else {
      fetchFilms(inputValue, pageNumber);
    }
  }
} // начало нового кода


function searchFilms(evt) {
  pageNumber = 1;
  evt.preventDefault();
  errorMessage.hidden = true;
  inputValue = input.value;

  if (inputValue === '') {
    jsList.innerHTML = '';
    fetchPopularMoviesList();
  } else {
    fetchFilms(inputValue, pageNumber);
  }
} // конец нового кода


function fetchFilms(inputValue, pageNumber) {
  if (inputValue === '') {
    return fetchPopularMoviesList();
  }

  var API;

  if (inputValue == '') {
    API = "https://api.themoviedb.org/3/movie/popular?api_key=8498946f9c7874ef33ac19a931c494c9&language=en-US&page=' + ".concat(pageNumber);
  } else {
    API = "\n    https://api.themoviedb.org/3/search/movie?api_key=8498946f9c7874ef33ac19a931c494c9&language=en-US&query=".concat(inputValue, "&page=").concat(pageNumber, "&include_adult=false");
  }

  fetch(API).then(function (response) {
    return response.json();
  }).then(function (data) {
    var arr = data.results;

    if (inputValue !== '' && arr.length === 0) {
      errorMessage.hidden = false;
      fetchPopularMoviesList();
    }

    jsList.innerHTML = '';
    arr.forEach(function (el) {
      if (el.backdrop_path != null) {
        createCardFunc(el.backdrop_path, el.title, el.id);
      } else if (el.poster_path != null) {
        createCardFunc(el.poster_path, el.title, el.id);
      } else {
        createCardFunc('logo', el.title, el.id);
      }
    });
  }).catch(function (error) {
    return console.log('ERROR' + error);
  });
  input.value = '';
}

form.addEventListener('submit', searchFilms);
"use strict";

var jsLogo = document.querySelector('#js-logo');
var homePageBtn = document.querySelector('#homePage-js');
var myLibraryPageBtn = document.querySelector('#myLibraryPage-js');
var detailsPageShown = document.querySelector('#detailsPage_show');
var myLibraryPageShown = document.querySelector('#myLibraryPage_show');
var homePageShown = document.querySelector('#homePage_show');
var jsList = document.querySelector('#js-list');
window.onload = showHomePage();
jsLogo.addEventListener('click', showHomePage);
myLibraryPageBtn.addEventListener('click', activeLibraryPage);
homePageBtn.addEventListener('click', showHomePage);
jsList.addEventListener('click', activeDetailsPage);

function showHomePage() {
  myLibraryPageShown.classList.add('page-disactive');
  detailsPageShown.classList.add('page-disactive');
  homePageShown.classList.remove('page-disactive');
  homePageBtn.classList.add('nav-bar__link-hover');
  myLibraryPageBtn.classList.remove('nav-bar__link-hover');
  document.title = 'Home Page';
  jsList.innerHTML = '';
  fetchPopularMoviesList();
}

function activeLibraryPage() {
  homePageShown.classList.add('page-disactive');
  detailsPageShown.classList.add('page-disactive');
  myLibraryPageShown.classList.remove('page-disactive');
  myLibraryPageBtn.classList.add('nav-bar__link-hover');
  homePageBtn.classList.remove('nav-bar__link-hover');
  cardLibrary.addEventListener('click', activeDetailsPage);
  drawWatchedFilmList();
  document.title = 'Library Page';
}

function activeDetailsPage(e) {
  var re = /page-disactive/;
  var classList = myLibraryPageShown.classList.value;
  if (e.target.nodeName !== 'LI') return;
  showDetailsPage(e.target.getAttribute('js-id'), !re.test(classList));
}

function showDetailsPage(movieId, itsLibraryFilm) {
  homePageShown.classList.remove('page-disactive');
  detailsPageShown.classList.add('page-disactive');
  myLibraryPageShown.classList.add('page-disactive');

  if (!itsLibraryFilm) {
    var ApiLink = "https://api.themoviedb.org/3/movie/".concat(movieId, "?api_key=8498946f9c7874ef33ac19a931c494c9");
    fetch(ApiLink).then(function (Response) {
      return Response.json();
    }).then(function (data) {
      selectFilm = data;

      if (selectFilm.poster_path === null) {
        selectFilm.poster_path = './images/logo.png';
      }

      document.title = selectFilm.title;
      homePageShown.classList.add('page-disactive');
      detailsPageShown.classList.remove('page-disactive');
      myLibraryPageShown.classList.add('page-disactive');
      showDetails(selectFilm);
    }).catch(function (error) {
      return console.log(error);
    });
  } else {
    var filmsQueue = JSON.parse(localStorage.getItem('filmsQueue'));
    var filmsWatched = JSON.parse(localStorage.getItem('filmsWatched'));
    selectFilm = filmsWatched.find(function (el) {
      return el.id == movieId;
    });

    if (selectFilm === undefined) {
      selectFilm = filmsQueue.find(function (el) {
        return el.id == movieId;
      });
    }

    homePageShown.classList.add('page-disactive');
    detailsPageShown.classList.remove('page-disactive');
    myLibraryPageShown.classList.add('page-disactive');
    showDetails(selectFilm);
    document.title = selectFilm.title;
  }
}
"use strict";

var btnWatched = document.querySelector('#btn--watched');
var btnQueue = document.querySelector('#btn--queue');
var ThisMovie = {
  watched: true,
  queue: true
};

function showDetails(data) {
  var popularity = document.querySelector('#js-popularity');
  var OriginTitle = document.querySelector('#js-origin-title');
  var Vote = document.querySelector('#js-vote');
  var VoteCount = document.querySelector('#js-votes-count');
  var Gender = document.querySelector('#js-genre');
  var description = document.querySelector('#js-description');
  var FilmTitle = document.querySelector('#js-Film-title');
  var Poster = document.querySelector('#js-poster');
  var genderText = ' ';

  if (data.genres != null && data.genres != undefined) {
    data.genres.forEach(function (el, i) {
      genderText += el.name;

      if (i != data.genres.length - 1) {
        genderText += ', ';
      }
    });
    popularity.textContent = data.popularity;
    OriginTitle.textContent = data.original_title;
    Vote.textContent = data.vote_average;
    VoteCount.textContent = data.vote_count;
    FilmTitle.textContent = data.title;
    description.textContent = data.overview;
    Gender.textContent = genderText;

    if (data.poster_path == './images/logo.png') {
      Poster.setAttribute('src', './images/logo.png');
    } else {
      Poster.setAttribute('src', "https://image.tmdb.org/t/p/w500".concat(data.poster_path));
    }

    monitorButtonStatusText();
  }
}

function monitorButtonStatusText() {
  if (isVarInLocalstorage('filmsQueue', selectFilm.id)) {
    btnQueue.firstChild.setAttribute('src', './images/calendar-minus.png');
    btnQueue.lastChild.textContent = 'Remove from queue';
    ThisMovie.queue = true;
  } else {
    btnQueue.firstChild.setAttribute('src', './images/calendar-plus.png');
    btnQueue.lastChild.textContent = 'Add to queue';
    ThisMovie.queue = false;
  }

  if (isVarInLocalstorage('filmsWatched', selectFilm.id)) {
    btnWatched.firstChild.setAttribute('src', './images/delete-video.png');
    btnWatched.lastChild.textContent = 'Remove from watched';
    ThisMovie.watched = true;
  } else {
    btnWatched.firstChild.setAttribute('src', './images/video.png');
    btnWatched.lastChild.textContent = 'Add to watched';
    ThisMovie.watched = false;
  }
}

function adtiveAddingBtn(key, test) {
  var arr = JSON.parse(localStorage.getItem(key));

  if (arr == null) {
    arr = [];
  }

  if (!test) {
    arr.push(selectFilm);
    localStorage.setItem(key, JSON.stringify(arr));
  } else {
    arr = arr.filter(function (el) {
      return el.id != selectFilm.id;
    });
    localStorage.setItem(key, JSON.stringify(arr));
  }

  monitorButtonStatusText();
}

function isVarInLocalstorage(key, id) {
  var Storage = JSON.parse(localStorage.getItem(key));

  if (Storage == null) {
    Storage = [];
    return false;
  }

  return Storage.find(function (el) {
    return el.id == id;
  }) != undefined;
}

btnQueue.addEventListener('click', function () {
  adtiveAddingBtn('filmsQueue', ThisMovie.queue);
});
btnWatched.addEventListener('click', function () {
  adtiveAddingBtn('filmsWatched', ThisMovie.watched);
});
"use strict";

var cardLibrary = document.querySelector('.library__list');
var libraryButtonWatch = document.querySelector('.library__btn--watch');
var libraryButtonQueue = document.querySelector('.library__btn--queue');
libraryButtonWatch.addEventListener('click', drawWatchedFilmList);
libraryButtonQueue.addEventListener('click', drawQueueFilmList);

function drawWatchedFilmList() {
  libraryButtonWatch.classList.add('library__btn--active');
  libraryButtonQueue.classList.remove('library__btn--active');
  cardLibrary.innerHTML = '';
  var local = JSON.parse(localStorage.getItem('filmsWatched'));

  if (local == null || local.length === 0) {
    cardLibrary.innerHTML = "<p class='text-warning'>You do not have watched movies. Add them.</p>";
  } else {
    local.forEach(function (el) {
      if (el.backdrop_path != null) {
        createLibraryCardFunc(el.backdrop_path, el.title, el.id, el.vote_average);
      } else {
        createLibraryCardFunc(el.poster_path, el.title, el.id, el.vote_average);
      }
    });
  }
}

function drawQueueFilmList() {
  libraryButtonWatch.classList.remove('library__btn--active');
  libraryButtonQueue.classList.add('library__btn--active');
  cardLibrary.innerHTML = '';
  var local = JSON.parse(localStorage.getItem('filmsQueue'));

  if (local == null || local.length === 0) {
    cardLibrary.innerHTML = "<p class='text-warning'>You do not have to queue movies to watch. Add them. </p>";
  } else {
    local.forEach(function (el) {
      if (el.backdrop_path != null) {
        createLibraryCardFunc(el.backdrop_path, el.title, el.id, el.vote_average);
      } else {
        createLibraryCardFunc(el.poster_path, el.title, el.id, el.vote_average);
      }
    });
  }
}

function createLibraryCardFunc(imgPath, filmTitle, movieId, voteAverage) {
  var link;

  if (imgPath == './images/logo.png') {
    link = './images/logo.png';
  } else {
    link = "https://image.tmdb.org/t/p/w500".concat(imgPath);
  }

  var liLibrary = "<li class =\"library__list-item\" js-id=\"".concat(movieId, "\">\n<img src=\"").concat(link, "\"  alt=\"poster film\">\n\n<p class=\"library__vote\">").concat(voteAverage, "</p>\n<p class=\"library__nameFilm\">").concat(filmTitle, "</p>\n</li>");
  cardLibrary.innerHTML += liLibrary;
}