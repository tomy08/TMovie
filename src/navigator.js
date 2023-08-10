const $ = (id) => document.querySelector(id);
const mainHeader = $(".main-header");
const mainSection = $(".main");
const movieHeader = $(".movie");
const genericList = $(".generic-list");
const movieDetail = $(".movieDetail-container");
const arrow = $(".header-arrow");
const searchForm = $(".search-form");
const searchBtn = $(".search-btn");
const searchInput = $(".search");

let page = 1;

// Assign event handler to the "scroll" event
// this event will be fired whenever the user scrolls the webpage
window.addEventListener("scroll", () => {
  // Get the current scroll position
  const currentScrollPosition = window.pageYOffset;
  // Get the total height of the document
  const totalDocumentHeight = document.body.offsetHeight;

  const windowHeight = window.innerHeight;
  // Check if the current scroll position is 200px before the end of the total height of the document
  if (currentScrollPosition + 200 >= totalDocumentHeight - windowHeight) {
    page++;
    // Check if the location hash starts with #category= and if so, call the categoryPage() function
    if (location.hash.startsWith("#category=")) {
      categoryPage();
    }
    // Check if the location hash starts with #search= and if so, call the searchPage() function
    if (location.hash.startsWith("#search=")) {
      searchPage();
    }
  }
});

// Assign event handler to the search button's click event
searchBtn.addEventListener("click", () => {
  // Change the location hash to search=inputValue when the search button is clicked
  location.hash = `search=${searchInput.value}`;
});

// Assign event handler to the arrow button's click event
arrow.addEventListener("click", () => {
  // Change the location hash to home when the arrow button is clicked
  location.hash = "home";
});

// Assign event handlers to the DOMContentLoaded and hashchange events
window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);

// function that handles navigation based on the current URL hash
function navigator() {
  // reset the page count to 1
  page = 1;
  // Check if the location hash starts with #search=
  if (location.hash.startsWith("#search=")) {
    // if so, call the searchPage() function
    searchPage();
  }
  // Check if the location hash starts with #movie=
  else if (location.hash.startsWith("#movie=")) {
    // if so, call the moviePage() function
    moviePage();
  }
  // Check if the location hash starts with #category=
  else if (location.hash.startsWith("#category=")) {
    // if so, call the categoryPage() function
    categoryPage();
  }
  // if none of the above conditions are met, assume it's the home page and call the homePage()
  else {
    homePage();
  }
  const container = document.querySelector(".grid");
  container.innerHTML = "";
}
function homePage() {
  mainHeader.classList.remove("inactive");
  mainSection.classList.remove("inactive");

  searchForm.classList.remove("inactive");
  searchForm.classList.remove("searcher-form-search");
  movieHeader.classList.add("inactive");
  genericList.classList.add("inactive");
  movieDetail.classList.add("inactive");
  arrow.classList.add("inactive");

  getCategoriesPreview();
  getCinemaMoviesPreview();
  getTrendingPreview();
  getLikedMovies();
}
function searchPage() {
  mainHeader.classList.add("inactive");
  mainSection.classList.add("inactive");
  movieHeader.classList.add("inactive");
  searchForm.classList.remove("inactive");
  searchForm.classList.add("searcher-form-search");
  genericList.classList.remove("inactive");
  movieDetail.classList.add("inactive");
  arrow.classList.remove("inactive");
  const h1 = $("#generic-list-title");
  h1.classList.add("inactive");
  const [_, query] = location.hash.split("=");
  getMoviesBySearch(query, page);
}
function moviePage() {
  mainHeader.classList.add("inactive");
  mainSection.classList.add("inactive");
  movieHeader.classList.remove("inactive");
  searchForm.classList.add("inactive");
  searchForm.classList.remove("searcher-form-search");
  genericList.classList.add("inactive");
  movieDetail.classList.remove("inactive");
  arrow.classList.remove("inactive");
  const [_, movieId] = location.hash.split("=");
  getMovieById(movieId);
}
function categoryPage() {
  console.log("category page!");
  mainHeader.classList.add("inactive");
  mainSection.classList.add("inactive");
  movieHeader.classList.add("inactive");
  searchForm.classList.add("inactive");
  searchForm.classList.remove("searcher-form-search");
  genericList.classList.remove("inactive");
  movieDetail.classList.add("inactive");
  arrow.classList.remove("inactive");
  const [_, data] = location.hash.split("=");
  const [idGenre, nameMovie] = data.split("-");
  const h1 = $("#generic-list-title");
  h1.classList.remove("inactive");
  h1.innerText = nameMovie;
  getMoviesByCategories(idGenre, page);
}
