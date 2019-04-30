const express = require('express');
const _ = require('lodash');

const auth = require('../../../common/middleware/authentication');
const { getMovies, addMovie, removeMovie } = require('../services/movies');

const router = new express.Router();

router.post('/', auth, async (req, res) => {
    const missing = [];
    const { title, id } = req.body;

    if (_.isNil(title)) missing.push('title');
    if (_.isNil(id)) missing.push('id');
    if (missing.length > 0) {
        return res.status(400).send({
            error: `Field(s) '${missing.join(',')}' required.`
        });
    }

    const movie = await addMovie(title, id);
    res.json(movie);
})

router.get('/', (req, res) => {
    getMovies().then(movies => res.json(movies));
})

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;

    const movie = await removeMovie(id);
    if (movie == null) {
        res.status(404).send();
    } else {
        res.json(movie);
    }
})

module.exports = router;