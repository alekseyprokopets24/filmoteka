const jsLogo = document.querySelector('#js-logo');
const homePageBtn = document.querySelector('#homePage-js');
const myLibraryPageBtn = document.querySelector('#myLibraryPage-js');
const detailsPageShown = document.querySelector('#detailsPage_show');
const myLibraryPageShown = document.querySelector('#myLibraryPage_show');
const homePageShown = document.querySelector('#homePage_show');
const jsList = document.querySelector('#js-list');


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
    const re = /page-disactive/;
    let classList = myLibraryPageShown.classList.value;
    
    if(e.target.nodeName !== 'LI') return;
    showDetailsPage(e.target.getAttribute('js-id'), !re.test(classList));    
}

function showDetailsPage(movieId, itsLibraryFilm) {

    homePageShown.classList.remove('page-disactive');
    detailsPageShown.classList.add('page-disactive');
    myLibraryPageShown.classList.add('page-disactive');
    if (!itsLibraryFilm) {
        let ApiLink = `https://api.themoviedb.org/3/movie/${movieId}?api_key=8498946f9c7874ef33ac19a931c494c9`;
        fetch(ApiLink)
            .then(Response => Response.json())
            .then(data => {
                selectFilm = data;
                if(selectFilm.poster_path === null){
                    selectFilm.poster_path = './images/logo.png';
                }
                document.title = selectFilm.title;
                homePageShown.classList.add('page-disactive');
                detailsPageShown.classList.remove('page-disactive');
                myLibraryPageShown.classList.add('page-disactive');
                showDetails(selectFilm);
            })
            .catch(error => console.log(error));
    } else {
        let filmsQueue = JSON.parse(localStorage.getItem('filmsQueue'));
        let filmsWatched = JSON.parse(localStorage.getItem('filmsWatched'));

        selectFilm = filmsWatched.find(el => el.id == movieId);
        if (selectFilm === undefined) {
            selectFilm = filmsQueue.find(el => el.id == movieId);
        }
        homePageShown.classList.add('page-disactive');
        detailsPageShown.classList.remove('page-disactive');
        myLibraryPageShown.classList.add('page-disactive');
        showDetails(selectFilm);
        document.title = selectFilm.title;
    }
}