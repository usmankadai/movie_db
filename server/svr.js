import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();
const app = express();
const port = 8080;

app.use(express.static('client'));

const apiKey = process.env.TMDB_API_KEY;
const authToken = process.env.TMDB_AUTH_TOKEN;

app.get('/api/movies', async (req, res) => {
    const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/movies/similar', async (req, res) => {
    const { genreIds } = req.query;
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json({ results: [] });
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=en-US&page=1&include_adult=false`;
    const options = { headers: { accept: 'application/json', Authorization: `Bearer ${authToken}` } };
    try {
        const response = await axios.get(url, options);
        res.json(response.data);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search' });
    }
});

app.get('/api/genres', async (req, res) => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en-US';
    const options = { headers: { accept: 'application/json', Authorization: `Bearer ${authToken}` } };
    try {
        const response = await axios.get(url, options);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
});

app.get('/api/discover', async (req, res) => {
    const { genre, year, duration } = req.query;
    let url = 'https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false';
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
    if (duration === 'short') url += '&with_runtime.lte=90';
    if (duration === 'medium') url += '&with_runtime.gte=90&with_runtime.lte=150';
    if (duration === 'long') url += '&with_runtime.gte=151';
    const options = { headers: { accept: 'application/json', Authorization: `Bearer ${authToken}` } };
    try {
        const response = await axios.get(url, options);
        res.json(response.data);
    } catch (error) {
        console.error('Error discovering movies:', error);
        res.status(500).json({ error: 'Failed to discover movies' });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/movies/:id/credits', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie credits:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.get('/api/movies/:id/release_dates', async (req, res) => {
    const { id } = req.params;
    const url = `https://api.themoviedb.org/3/movie/${id}/release_dates`;
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    };

    try {
        const response = await axios.get(url, options);
        const data = response.data;
        res.json(data);
    } catch (error) {
        console.error('Error fetching movie release dates:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
