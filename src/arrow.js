/// Move the content to the right when the right arrow is clicked
function arrowRight(content, arrow) {
  arrow.addEventListener("click", () => {
    content.scrollLeft += pixelsPerGroup;
  });
}

// Move the content to the left when the left arrow is clicked
function arrowLeft(content, arrow) {
  arrow.addEventListener("click", () => {
    content.scrollLeft -= pixelsPerGroup;
  });
}

const leftArrowTrending = document.querySelector(".arrow.left.trending");
const rightArrowTrending = document.querySelector(".arrow.right.trending");
const contentTrending = document.querySelector(".trendingPreview-movieList");

//Add event listener to the resize event
window.addEventListener("resize", () => {
  elementsPerGroup = Math.floor(contentTrending.clientWidth / 150);
});
//Get the number of pixels per group based on the width of the content
pixelsPerGroup = Math.floor(contentTrending.clientWidth / 150) * 150;

arrowRight(contentTrending, rightArrowTrending);
arrowLeft(contentTrending, leftArrowTrending);

const leftArrowTheatre = document.querySelector(".arrow.left.theatre");
const rightArrowTheatre = document.querySelector(".arrow.right.theatre");
const contentTheatre = document.querySelector(".theatersPreview-movieList");

arrowRight(contentTheatre, rightArrowTheatre);
arrowLeft(contentTheatre, leftArrowTheatre);

const leftArrowRelated = document.querySelector(".arrow.left.similarMovies");
const rightArrowRelated = document.querySelector(".arrow.right.similarMovies");
const contentRelated = document.querySelector(".relatedMovies-scrollContainer");

arrowRight(contentRelated, rightArrowRelated);
arrowLeft(contentRelated, leftArrowRelated);
