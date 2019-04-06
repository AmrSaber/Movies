const express = require('express')
const { getMovies, addMovie, removeMovie } = require('../common/movies')

const router = new express.Router()

router.post('/', (req, res) => {
    const missing = []
    const { title, id } = req.body

    if (title == undefined) missing.push('title')
    if (id == undefined) missing.push('id')
    if (missing.length > 0) {
        return res.status(400).send({
            error: `Field(s) '${missing.join(',')}' required.`
        })
    }

    addMovie(title, id)
    res.send()
})

router.get('/', (req, res) => {
    res.send({
        movies: getMovies()
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params

    try {
        removeMovie(id)
        res.send()
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router