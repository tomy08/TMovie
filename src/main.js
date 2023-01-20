// Declare a constant variable called API_KEY which holds the API key for the movie database
const API_KEY = "6e8db32180c209b1e49abf1c2112ea2a";
// Create an axios instance with the base url of the movie database and the API key as a parameter
const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: API_KEY,
    // Use the browser's language or default to "en-EN"
    language: navigator.language || "en-EN",
  },
});

// Function to retrieve the list of liked movies from local storage
function likedMovieList() {
  // Parse the "liked_movies" item from local storage into a JavaScript object
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;
  // If the item exists, set the movies variable to it
  if (item) {
    movies = item;
  } else {
    // Otherwise, set the movies variable to an empty object
    movies = {};
  }
  // Return the movies object
  return movies;
}

// Function to toggle a movie as liked or not liked
async function likeMovie() {
  // Get the movie ID from the URL hash
  const [_, movieId] = location.hash.split("=");
  // Make a request to the movie database to get the movie information
  const { data: movie } = await api(`movie/${movieId}`);
  // Get the list of liked movies
  const likedMovies = likedMovieList();
  // If the movie is already in the liked movies list, remove it
  if (likedMovies[movieId]) {
    likedMovies[movieId] = undefined;
  } else {
    // Otherwise, add the movie to the liked movies list
    likedMovies[movieId] = movie;
  }
  // Save the updated liked movies list to local storage
  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}

// Get the "favorite-btn" element from the DOM
const listButton = document.querySelector(".favorite-btn");

// Add a click event listener to the button
listButton.addEventListener("click", () => {
  // If the button text is "➖", change it to "➕"
  if (listButton.innerText === "➖") {
    listButton.innerText = "➕";
    // Otherwise, change it to "➖"
  } else {
    listButton.innerText = "➖";
  }
  // Call the likeMovie function
  likeMovie();
});

// Create an IntersectionObserver to lazy load images
const observer = new IntersectionObserver((entries) => {
  // For each entry that is intersecting with the viewport
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Get the image URL from the "data-img" attribute
      const URL = entry.target.getAttribute("data-img");
      // Set the "src" attribute of the image to the URL
      entry.target.setAttribute("src", URL);
    }
  });
});

// Function to create movie elements and add them to the DOM
function createMovies(movies, container, observe = false) {
  // Initialize a delay variable
  let delay = 0;
  // For each movie in the list
  movies.forEach((movie) => {
    // Increase the delay by 0.2 seconds
    delay += 0.2;
    // Create a container element for the movie
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    // Add a click event listener to the container to navigate to the movie's page
    movieContainer.addEventListener("click", () => {
      location.hash = `movie=${movie.id}`;
    });
    // Create an image element for the movie poster
    const img = document.createElement("img");
    img.classList.add("movie-img");
    // Set the "src" or "data-img" attribute of the image based on the observe parameter
    img.setAttribute(
      observe ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );
    // Add an error event listener to the image in case the poster is not available
    img.addEventListener("error", () => {
      span = document.createElement("span");
      span.classList.add("movie-title-error");
      span.textContent = movie.title;
      movieContainer.append(span);
      img.style.animation = "none";
      img.setAttribute("src", "./img/Image-not-available.png");
    });
    // Set the animation delay of the image based on the delay variable
    img.style.setProperty("animation-delay", `${delay}s`);
    // Append the image to the container
    movieContainer.append(img);
    img.setAttribute("alt", movie.original_title);

    // If the observe parameter is true, observe the image with the IntersectionObserver
    if (observe) {
      observer.observe(img);
    }

    // Append the container to the specified container element
    container.append(movieContainer);
  });
  // Get all the movie image elements and remove the animation when they are loaded
  document.querySelectorAll(".movie-img").forEach((img) => {
    img.addEventListener("load", () => {
      img.style.animation = "none";
    });
  });
}
// Function to create category elements and add them to the DOM
function createCategories(genres, container) {
  // Clear the container's inner HTML
  container.innerHTML = "";
  // For each genre in the list
  genres.forEach((genre) => {
    // Create a container element for the genre
    const genreContainer = document.createRange().createContextualFragment(
      `   <article class="categoriesPreview-list">
      <div class="category-container">
        <h3 id="id${genre.id}" class="category-title">${genre.name}</h3>
      </div>
    </article>`
    );
    // Append the genre container to the specified container element
    container.append(genreContainer);
  });
}

// Function to get the trending movie preview from the movie database
async function getTrendingPreview() {
  // Make a request to the movie database to get the trending movies of the day
  const { data } = await api("trending/movie/day");
  const movies = data.results;
  // Select the container where the movies will be displayed
  const container = document.querySelector(".trendingPreview-movieList");
  // Function to create and display the movies in the selected container
  createMovies(movies, container, true);
}

async function getCinemaMoviesPreview() {
  // Make a request to the movie database to get the movies currently showing in theaters
  const { data } = await api("movie/now_playing");
  const movies = data.results;
  // Select the container where the movies will be displayed
  const container = document.querySelector(".theatersPreview-movieList");
  // Function to create and display the movies in the selected container
  createMovies(movies, container, true);
}

async function getCategoriesPreview() {
  // Make a request to the movie database to get the genres of movies
  const { data } = await api("genre/movie/list");
  const genres = data.genres;

  // Select the container where the genres will be displayed
  const container = document.querySelector("#genre-container");

  // Function to create and display the genres in the selected container
  createCategories(genres, container);

  // Add event listeners to each genre title to redirect to movies of that genre
  const categoryTitle = document.querySelectorAll(".category-title");

  categoryTitle.forEach((title) => {
    title.addEventListener("click", () => {
      const [_, id] = title.id.split("d");
      location.hash = `category=${id}-${title.textContent}`;
    });
  });
}

async function getMoviesByCategories(id, page) {
  // Make a request to the movie database to get the movies of a specific genre based on the genre's id
  const { data } = await api("discover/movie", {
    params: {
      with_genres: id,
      page,
    },
  });
  const movies = data.results;
  // Select the container where the movies will be displayed
  const container = document.querySelector(".grid");
  // Function to create and display the movies in the selected container
  createMovies(movies, container);
}

async function getMoviesBySearch(query, page) {
  // Make a request to the movie database to get the movies based on a search query
  const { data } = await api("search/movie", {
    params: {
      query,
      page,
    },
  });

  const movies = data.results;
  // Select the container where the movies will be displayed
  const container = document.querySelector(".grid");
  // Function to create and display the movies in the selected container
  createMovies(movies, container);
}
async function getMovieById(id) {
  // Make a request to the movie database to get detailed information about a specific movie by its id
  const { data } = await api(`movie/${id}`);

  // Select the element where the title of the movie will be displayed
  const movieTitle = document.querySelector(".movieDetail-title");
  movieTitle.textContent = data.title;

  // Select the element where the score of the movie will be displayed
  const movieScore = document.querySelector(".movieDetail-score");
  movieScore.textContent = data.vote_average;

  // Select the element where the description of the movie will be displayed
  const movieDescription = document.querySelector(".movieDetail-description");
  movieDescription.textContent = data.overview;

  // Select the container where the genres of the movie will be displayed
  const container = document.querySelector(".categories-list");
  // Function to create and display the genres in the selected container
  createCategories(data.genres, container);

  // Select the element where the banner image of the movie will be displayed
  const movieBanner = document.querySelector(".header-container--blur");
  // Apply the banner image of the movie as the background of the selected element
  movieBanner.style.background = `
    linear-gradient(
      180deg, 
      rgba(0, 0, 0, 0.35) 19.27%, 
      rgba(0, 0, 0, 0) 29.17%
    ),
    url(https://image.tmdb.org/t/p/w500/${data.backdrop_path})`;

  // Select the element where the poster image of the movie will be displayed
  const movieImg = document.querySelector(".header-container--long");
  // Apply the poster image of the movie as the source of the selected element
  movieImg.setAttribute(
    "src",
    `https://image.tmdb.org/t/p/w500/${data.poster_path}`
  );

  // Select the element where the "add to favorite list" button will be displayed
  const listButton = document.querySelector(".favorite-btn");
  // Check if the movie is already in the user's favorite list
  if (likedMovieList()[data.id]) {
    listButton.innerText = "➖";
  } else {
    listButton.innerText = "➕";
  }

  // Retrieve recommended movies based on the current movie's id
  getRelatedMovieById(id);
}

async function getRelatedMovieById(id) {
  // Make a request to the movie database to get recommended movies based on a specific movie's id
  const { data } = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;

  // Select the container where the recommended movies will be displayed
  const container = document.querySelector(".relatedMovies-scrollContainer");
  container.innerHTML = "";

  // Function to create and display the recommended movies in the selected container
  createMovies(relatedMovies, container, true);
}

function getLikedMovies() {
  // Select the container where the liked movies will be displayed
  const container = document.querySelector(".likedPreview-movieList");
  // Retrieve the movies that the user has liked
  const likedMovies = likedMovieList();
  container.innerHTML = "";
  const moviesArray = Object.values(likedMovies);
  // Function to create and display the liked movies in the selected container
  createMovies(moviesArray, container, true);
}
