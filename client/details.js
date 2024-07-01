// Function to add event listener to the 'browse' link
function addBrowseEventListener() {
    const browseLink = document.querySelector('.browse');
    if (browseLink) {
        browseLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// Function to add event listener to the 'button-container' link
function addButtonContainerEventListener() {
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
        buttonContainer.addEventListener('click', (event) => {
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

// Function to generate a crew member element
function generateCrewMember(position, name) {
    const crewMemberSpan = document.createElement('span');
    crewMemberSpan.className = 'crew-member';

    const positionSpan = document.createElement('span');
    positionSpan.className = 'position';
    const positionTextSpan = document.createElement('span');
    positionTextSpan.className = 'position-text';
    positionTextSpan.textContent = position;
    positionSpan.appendChild(positionTextSpan);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'director-name';
    nameSpan.textContent = name;

    crewMemberSpan.appendChild(positionSpan);
    crewMemberSpan.appendChild(nameSpan);

    return crewMemberSpan;
}

// Function to fetch and display the movie overview and similar movies
async function fetchAndDisplayMovieDetails() {
    const movieId = getMovieIdFromQuery();
    if (!movieId) {
        console.error('No movie ID found in query string');
        return;
    }

    try {
        const [movie, credits, releases] = await Promise.all([
            fetch(`/api/movies/${movieId}`).then(response => response.json()),
            fetch(`/api/movies/${movieId}/credits`).then(response => response.json()),
            fetch(`/api/movies/${movieId}/release_dates`).then(response => response.json())
        ]);

        const movieOverviewDiv = document.createElement('div');
        movieOverviewDiv.className = 'movie-overview';

        const movieImg = document.createElement('img');
        movieImg.className = 'movie-overview-img';
        movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        movieImg.alt = movie.title;

        const movieContentDiv = document.createElement('div');
        movieContentDiv.className = 'movie-content';

        const movieNameSpan = document.createElement('span');
        movieNameSpan.className = 'movie_overview_name';
        movieNameSpan.textContent = movie.title;

        const movieMetaDiv = document.createElement('div');
        movieMetaDiv.className = 'movie_meta_container';

        const ratingSpan = document.createElement('span');
        ratingSpan.className = 'rating';

        const starSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starSvg.className = 'stars';
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
        ratingPercentSpan.className = 'rating-percents';
        ratingPercentSpan.textContent = `${movie.vote_average}`;

        ratingSpan.appendChild(starSvg);
        ratingSpan.appendChild(ratingPercentSpan);

        const movieDetailsSpan = document.createElement('span');
        movieDetailsSpan.className = 'movie-details';

        const pgRatingSpan = document.createElement('span');
        pgRatingSpan.className = 'pg-rating';

        const pgRatingTextSpan = document.createElement('span');
        pgRatingTextSpan.className = 'pg-rating-text';
        const usRelease = releases.results.find(release => release.iso_3166_1 === 'US');
        let pgRating = 'Not Rated';
        if (usRelease) {
            const certification = usRelease.release_dates.find(date => date.certification);
            pgRating = certification ? certification.certification : 'Not Rated';
        }
        pgRatingTextSpan.textContent = pgRating;
        pgRatingSpan.appendChild(pgRatingTextSpan);

        const movieYearSpan = document.createElement('span');
        movieYearSpan.className = 'movie-details-year';
        movieYearSpan.textContent = `${new Date(movie.release_date).getFullYear()}`;

        const movieDurationSpan = document.createElement('span');
        movieDurationSpan.className = 'movie-details-duration';
        movieDurationSpan.textContent = formatDuration(movie.runtime);

        movieDetailsSpan.appendChild(pgRatingSpan);
        movieDetailsSpan.appendChild(movieYearSpan);
        movieDetailsSpan.appendChild(movieDurationSpan);

        const movieCategoriesSpan = document.createElement('span');
        movieCategoriesSpan.className = 'movie-categories';
        movie.genres.forEach(genre => {
            const categorySpan = document.createElement('span');
            categorySpan.className = 'movie-category';

            const categoryTextSpan = document.createElement('span');
            categoryTextSpan.className = 'category';
            categoryTextSpan.textContent = genre.name;

            categorySpan.appendChild(categoryTextSpan);
            movieCategoriesSpan.appendChild(categorySpan);
        });

        movieMetaDiv.appendChild(ratingSpan);
        movieMetaDiv.appendChild(movieDetailsSpan);
        movieMetaDiv.appendChild(movieCategoriesSpan);

        const overviewDiv = document.createElement('div');
        overviewDiv.className = 'overview';

        const overviewLabelSpan = document.createElement('span');
        overviewLabelSpan.className = 'movie-overview-label';

        const overviewLabelTextSpan = document.createElement('span');
        overviewLabelTextSpan.className = 'movie-overview-label-text';
        overviewLabelTextSpan.textContent = 'Overview';

        overviewLabelSpan.appendChild(overviewLabelTextSpan);

        const overviewTextSpan = document.createElement('span');
        overviewTextSpan.className = 'movie-overview-text';
        overviewTextSpan.textContent = movie.overview;

        overviewDiv.appendChild(overviewLabelSpan);
        overviewDiv.appendChild(overviewTextSpan);

        const teamContainerDiv = document.createElement('div');
        teamContainerDiv.className = 'team-container';

        const director = credits.crew.find(member => member.job === 'Director');
        const writers = credits.crew.filter(member => ['Writer', 'Screenplay', 'Story'].includes(member.job));

        if (director) {
            teamContainerDiv.appendChild(generateCrewMember('Director', director.name));
        }
        if (writers.length > 0) {
            const writerNames = writers.map(writer => writer.name).join(', ');
            teamContainerDiv.appendChild(generateCrewMember('Writers', writerNames));
        }

        movieContentDiv.appendChild(movieNameSpan);
        movieContentDiv.appendChild(movieMetaDiv);
        movieContentDiv.appendChild(overviewDiv);
        movieContentDiv.appendChild(teamContainerDiv);

        movieOverviewDiv.appendChild(movieImg);
        movieOverviewDiv.appendChild(movieContentDiv);

        const siteContainersDiv = document.querySelector('.site-containers');
        siteContainersDiv.appendChild(movieOverviewDiv);

        // Fetch and display similar movies
        await fetchAndDisplaySimilarMovies(movie.genres);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to fetch and display similar movies
async function fetchAndDisplaySimilarMovies(genres) {
    const genreIds = genres.map(genre => genre.id).join(',');
    const similarMoviesUrl = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjY3ZGQ4N2U2NDgzMzYyZmI4YTFhYzRlYjQxOGQyYSIsIm5iZiI6MTcxOTMxODQzOS4wMzQwODMsInN1YiI6IjY2N2FhZDY5Y2FmZGQwNjhlNmEwYWNmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hs88N37hPwnCK7CX6WSYm8l1V90SQ0pGFeEyUIS9Pd8'
        }
    };

    try {
        const response = await fetch(similarMoviesUrl, options);
        const data = await response.json();
        const similarMovies = data.results.filter(movie => 
            movie.genre_ids.some(genreId => genreIds.includes(genreId))
        ).slice(0, 15); // Filter movies and limit to 15 movies

        const similarMoviesContainerDiv = document.createElement('div');
        similarMoviesContainerDiv.className = 'similar-movies-container';

        const moreMoviesSpan = document.createElement('span');
        moreMoviesSpan.className = 'more-movies';

        // Generate the genre text
        const genreText = genres.map(genre => genre.name).join(', ').replace(/,([^,]*)$/, ' and$1');
        moreMoviesSpan.textContent = `More ${genreText} Movies`;

        similarMoviesContainerDiv.appendChild(moreMoviesSpan);

        const similarMoviesDiv = document.createElement('div');
        similarMoviesDiv.className = 'similar-movies';

        similarMovies.forEach(movie => {
            const movieElement = generateMovieElement(movie);
            similarMoviesDiv.appendChild(movieElement);
        });

        similarMoviesContainerDiv.appendChild(similarMoviesDiv);

        const siteContainersDiv = document.querySelector('.site-containers');
        siteContainersDiv.appendChild(similarMoviesContainerDiv);
    } catch (error) {
        console.error('Error fetching similar movies:', error);
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

// Function to format the movie duration
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

// Function to get the movie ID from the query string
function getMovieIdFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Initialization function
async function init() {
    await fetchAndDisplayMovieDetails();
    addBrowseEventListener();
    addButtonContainerEventListener();
    addSiteLogoEventListener();
}

window.addEventListener('load', init);
