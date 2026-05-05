// ── D-pad navigation ──────────────────────────────────────────
let focusedIndex = -1;

function focusCard(index) {
    const cards = document.querySelectorAll('.movie');
    if (!cards.length) return;
    focusedIndex = Math.max(0, Math.min(cards.length - 1, index));
    cards.forEach((c, i) => c.classList.toggle('focused', i === focusedIndex));
    cards[focusedIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getColumnsCount() {
    const cards = [...document.querySelectorAll('.movie')];
    if (cards.length < 2) return 1;
    const firstTop = cards[0].getBoundingClientRect().top;
    let cols = 0;
    for (const card of cards) {
        if (Math.abs(card.getBoundingClientRect().top - firstTop) < 5) cols++;
        else break;
    }
    return Math.max(1, cols);
}

document.addEventListener('keydown', (e) => {
    if (document.activeElement === document.querySelector('.search-input')) return;
    const cards = document.querySelectorAll('.movie');
    if (!cards.length) return;
    if (focusedIndex === -1) { focusCard(0); return; }
    const cols = getColumnsCount();
    switch (e.key) {
        case 'ArrowRight': e.preventDefault(); focusCard(focusedIndex + 1); break;
        case 'ArrowLeft':  e.preventDefault(); focusCard(focusedIndex - 1); break;
        case 'ArrowDown':  e.preventDefault(); focusCard(focusedIndex + cols); break;
        case 'ArrowUp':    e.preventDefault(); focusCard(focusedIndex - cols); break;
        case 'Enter':      cards[focusedIndex].click(); break;
    }
});

// ── State ─────────────────────────────────────────────────────
let searchQuery = '';
let filterGenre = '';
let filterYear = '';
let filterDuration = '';

// ── Utilities ─────────────────────────────────────────────────
function debounce(fn, ms) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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

// ── Render ────────────────────────────────────────────────────
function renderMovies(movies) {
    focusedIndex = -1;
    const moviesDiv = document.querySelector('.movies');
    moviesDiv.innerHTML = '';

    if (!movies.length) {
        const empty = document.createElement('p');
        empty.className = 'empty-text';
        empty.textContent = 'No movies found.';
        moviesDiv.appendChild(empty);
        return;
    }

    movies.forEach(movie => moviesDiv.appendChild(generateMovieElement(movie)));
    focusCard(0);
}

async function fetchAndRender() {
    const label = document.querySelector('.section-label');
    const moviesDiv = document.querySelector('.movies');
    moviesDiv.innerHTML = '';
    const loading = document.createElement('span');
    loading.className = 'loading-text';
    loading.textContent = 'Loading…';
    moviesDiv.appendChild(loading);

    try {
        let movies = [];

        if (searchQuery.trim()) {
            if (label) label.textContent = `Results for "${searchQuery.trim()}"`;
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
            const data = await res.json();
            movies = data.results.slice(0, 20);
        } else if (filterGenre || filterYear || filterDuration) {
            const params = new URLSearchParams();
            if (filterGenre) params.set('genre', filterGenre);
            if (filterYear) params.set('year', filterYear);
            if (filterDuration) params.set('duration', filterDuration);
            if (label) {
                const parts = [];
                if (filterGenre) parts.push(document.querySelector('#filter-genre').selectedOptions[0].text);
                if (filterYear) parts.push(filterYear);
                if (filterDuration) parts.push({ short: '< 90 min', medium: '90–150 min', long: '> 150 min' }[filterDuration]);
                label.textContent = parts.join(' • ');
            }
            const res = await fetch(`/api/discover?${params}`);
            const data = await res.json();
            movies = data.results.slice(0, 20);
        } else {
            if (label) label.textContent = 'Trending Today';
            const res = await fetch('/api/movies');
            const data = await res.json();
            movies = shuffleArray(data.results).slice(0, 15);
        }

        renderMovies(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        moviesDiv.innerHTML = '';
    }
}

// ── Search ────────────────────────────────────────────────────
function setupSearch() {
    const input = document.querySelector('.search-input');
    const clearBtn = document.querySelector('.search-clear');

    input.addEventListener('input', debounce(() => {
        searchQuery = input.value;
        clearBtn.classList.toggle('visible', !!input.value);
        fetchAndRender();
    }, 400));

    clearBtn.addEventListener('click', () => {
        input.value = '';
        searchQuery = '';
        clearBtn.classList.remove('visible');
        fetchAndRender();
    });
}

// ── Filters ───────────────────────────────────────────────────
async function populateGenres() {
    try {
        const res = await fetch('/api/genres');
        const data = await res.json();
        const select = document.querySelector('#filter-genre');
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

function populateYears() {
    const select = document.querySelector('#filter-year');
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2000; y--) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        select.appendChild(option);
    }
}

function setupFilters() {
    document.querySelector('#filter-genre').addEventListener('change', (e) => {
        filterGenre = e.target.value;
        fetchAndRender();
    });

    document.querySelector('#filter-year').addEventListener('change', (e) => {
        filterYear = e.target.value;
        fetchAndRender();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterDuration = btn.dataset.duration;
            fetchAndRender();
        });
    });

    document.querySelector('.filter-reset').addEventListener('click', () => {
        filterGenre = '';
        filterYear = '';
        filterDuration = '';
        document.querySelector('#filter-genre').value = '';
        document.querySelector('#filter-year').value = '';
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.filter-btn[data-duration=""]').classList.add('active');
        fetchAndRender();
    });
}

// ── Event listeners ───────────────────────────────────────────
function addBrowseEventListener() {
    const browseLink = document.querySelector('.browse');
    if (browseLink) {
        browseLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

function addSiteLogoEventListener() {
    const siteLogo = document.querySelector('.site-logo');
    if (siteLogo) {
        siteLogo.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// ── Init ──────────────────────────────────────────────────────
async function init() {
    const siteContainer = document.querySelector('.site-container');

    const label = document.createElement('div');
    label.className = 'section-label';
    siteContainer.appendChild(label);

    const moviesDiv = document.createElement('div');
    moviesDiv.className = 'movies';
    siteContainer.appendChild(moviesDiv);

    await Promise.all([fetchAndRender(), populateGenres()]);
    populateYears();
    addBrowseEventListener();
    addSiteLogoEventListener();
    setupSearch();
    setupFilters();
}

window.addEventListener('load', init);
