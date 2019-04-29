const express = require('express');

const auth = require('../../../common/middleware/authentication');
const { getMovies, addMovie, removeMovie } = require('../services/movies');

const router = new express.Router();

router.post('/', auth, (req, res) => {
    const missing = [];
    const { title, id } = req.body;

    if (title == undefined) missing.push('title');
    if (id == undefined) missing.push('id');
    if (missing.length > 0) {
        return res.status(400).send({
            error: `Field(s) '${missing.join(',')}' required.`
        });
    }

    addMovie(title, id);
    res.send();
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
        res.send();
    }
})

module.exports = router;