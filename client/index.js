// Add event listener to the 'browse' link
function addBrowseEventListener() {
    const browseLink = document.querySelector('.browse');
    if (browseLink) {
        browseLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// Function to add event listener to the 'site-logo'
function addSiteLogoEventListener() {
    const siteLogo = document.querySelector('.site-logo');
    if (siteLogo) {
        siteLogo.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// Function to generate a movie element
function generateMovieElement(movie) {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie';
    movieDiv.addEventListener('click', () => {
        window.location.href = `details.html?id=${movie.id}`;
    });

    const movieImg = document.createElement('img');
    movieImg.className = 'movie-img';
    movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieImg.alt = movie.title;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';

    const movieNameSpan = document.createElement('span');
    movieNameSpan.className = 'movie_name';
    movieNameSpan.textContent = movie.title;

    const ratingSpan = document.createElement('span');
    ratingSpan.className = 'rating';

    const starSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    starSvg.className = 'star';
    starSvg.setAttribute('width', '16');
    starSvg.setAttribute('height', '16');
    starSvg.setAttribute('viewBox', '0 0 16 16');
    starSvg.setAttribute('fill', 'none');
    starSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8ZM9.67857 5.68929L13.4321 6.23571L10.7143 8.88571L11.3571 12.625L8 10.8571L4.64286 12.6214L5.28571 8.88214L2.56429 6.23571L6.32143 5.68929L8 2.28571L9.67857 5.68929Z');
    path.setAttribute('fill', '#4F80E2');

    starSvg.appendChild(path);

    const ratingPercentSpan = document.createElement('span');
    ratingPercentSpan.className = 'rating-percent';
    ratingPercentSpan.textContent = `${movie.vote_average}`;

    ratingSpan.appendChild(starSvg);
    ratingSpan.appendChild(ratingPercentSpan);

    contentDiv.appendChild(movieNameSpan);
    contentDiv.appendChild(ratingSpan);

    movieDiv.appendChild(movieImg);
    movieDiv.appendChild(contentDiv);

    return movieDiv;
}

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialization function
async function init() {
    await createMovieElements();
    addBrowseEventListener();
    addSiteLogoEventListener();
}

// Function to fetch movie data from the API and create movie elements
async function createMovieElements() {
    const url = '/api/movies';
    try {
        const response = await fetch(url);
        const data = await response.json();
        const shuffledResults = shuffleArray(data.results).slice(0, 15);

        const siteContainer = document.querySelector('.site-container');
        const moviesDiv = document.createElement('div');
        moviesDiv.className = 'movies';

        shuffledResults.forEach(movie => {
            const movieElement = generateMovieElement(movie);
            moviesDiv.appendChild(movieElement);
        });

        siteContainer.appendChild(moviesDiv);
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

window.addEventListener('load', init);
