const API_KEY = '6e8db32180c209b1e49abf1c2112ea2a'
// Create an axios instance with the base url of the movie database and the API key as a parameter
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: API_KEY,
    // Use the browser's language or default to "en-EN"
    language: navigator.language || 'en-EN',
  },
})

// Function to retrieve the list of liked movies from local storage
function likedMovieList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'))
  let movies

  if (item) {
    movies = item
  } else {
    movies = {}
  }

  return movies
}

// Function to toggle a movie as liked or not liked
async function likeMovie() {
  const [_, movieId] = location.hash.split('=')

  const { data: movie } = await api(`movie/${movieId}`)

  const likedMovies = likedMovieList()

  if (likedMovies[movieId]) {
    likedMovies[movieId] = undefined
  } else {
    likedMovies[movieId] = movie
  }

  localStorage.setItem('liked_movies', JSON.stringify(likedMovies))
}

const listButton = document.querySelector('.favorite-btn')

listButton.addEventListener('click', () => {
  if (listButton.innerText === 'Remove from list') {
    listButton.innerText = 'Add to list'
  } else {
    listButton.innerText = 'Remove from list'
  }

  likeMovie()
})

// Create an IntersectionObserver to lazy load images
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const URL = entry.target.getAttribute('data-img')

      entry.target.setAttribute('src', URL)
    }
  })
})

// Function to create movie elements and add them to the DOM
function createMovies(movies, container, observe = false) {
  let delay = 0

  movies.forEach((movie) => {
    delay += 0.2

    const movieContainer = document.createElement('div')
    movieContainer.classList.add('movie-container')

    movieContainer.addEventListener('click', () => {
      location.hash = `movie=${movie.id}`
    })

    const img = document.createElement('img')
    img.classList.add('movie-img')

    img.setAttribute(
      observe ? 'data-img' : 'src',
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    )

    img.addEventListener('error', () => {
      span = document.createElement('span')
      span.classList.add('movie-title-error')
      span.textContent = movie.title
      movieContainer.append(span)
      img.style.animation = 'none'
      img.setAttribute('src', './img/Image-not-available.png')
    })

    img.style.setProperty('animation-delay', `${delay}s`)
    movieContainer.append(img)
    img.setAttribute('alt', movie.original_title)

    if (observe) {
      observer.observe(img)
    }

    container.append(movieContainer)
  })

  document.querySelectorAll('.movie-img').forEach((img) => {
    img.addEventListener('load', () => {
      img.style.animation = 'none'
    })
  })
}

// Function to create category elements and add them to the DOM
function createCategories(genres, container) {
  container.innerHTML = ''

  genres.forEach((genre) => {
    const genreContainer = document.createRange().createContextualFragment(
      `   <article class="categoriesPreview-list">
      <div class="category-container">
        <h3 id="id${genre.id}" class="category-title">${genre.name}</h3>
      </div>
    </article>`
    )

    container.append(genreContainer)
  })
}

async function getTrendingPreview() {
  const { data } = await api('trending/movie/day')
  const movies = data.results

  const container = document.querySelector('.trendingPreview-movieList')

  createMovies(movies, container, true)
}

async function getCinemaMoviesPreview() {
  const { data } = await api('movie/now_playing')
  const movies = data.results

  const container = document.querySelector('.theatersPreview-movieList')

  createMovies(movies, container, true)
}

async function getCategoriesPreview() {
  const { data } = await api('genre/movie/list')
  const genres = data.genres

  const container = document.querySelector('#genre-container')

  createCategories(genres, container)

  const categoryTitle = document.querySelectorAll('.category-title')

  categoryTitle.forEach((title) => {
    title.addEventListener('click', () => {
      const [_, id] = title.id.split('d')
      location.hash = `category=${id}-${title.textContent}`
    })
  })
}

async function getMoviesByCategories(id, page) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
      page,
    },
  })
  const movies = data.results

  const container = document.querySelector('.grid')

  createMovies(movies, container)
}

async function getMoviesBySearch(query, page) {
  const { data } = await api('search/movie', {
    params: {
      query,
      page,
    },
  })

  const movies = data.results

  const container = document.querySelector('.grid')

  createMovies(movies, container)
}
async function getMovieById(id) {
  const { data } = await api(`movie/${id}`)

  const movieTitle = document.querySelector('.movieDetail-title')
  movieTitle.textContent = data.title

  const movieScore = document.querySelector('.movieDetail-score')
  movieScore.textContent = data.vote_average

  const movieDescription = document.querySelector('.movieDetail-description')
  movieDescription.textContent = data.overview

  const container = document.querySelector('.categories-list')

  createCategories(data.genres, container)

  const movieImg = document.querySelector('.header-container--long')

  movieImg.setAttribute(
    'src',
    `https://image.tmdb.org/t/p/w500/${data.poster_path}`
  )

  const listButton = document.querySelector('.favorite-btn')

  if (likedMovieList()[data.id]) {
    listButton.innerText = 'Remove from list'
  } else {
    listButton.innerText = 'Add to list'
  }
  getRelatedMovieById(id)
}

async function getRelatedMovieById(id) {
  const { data } = await api(`movie/${id}/recommendations`)
  const relatedMovies = data.results

  const container = document.querySelector('.relatedMovies-scrollContainer')
  container.innerHTML = ''

  createMovies(relatedMovies, container, true)
}

function getLikedMovies() {
  const likedMovieContainer = document.querySelector('.likedPreview')
  const container = document.querySelector('.likedPreview-movieList')

  const likedMovies = likedMovieList()
  container.innerHTML = ''
  if (Object.keys(likedMovies).length === 0) {
    likedMovieContainer.innerHTML = ``
  } else {
    const moviesArray = Object.values(likedMovies)
    createMovies(moviesArray, container, true)
  }
}
