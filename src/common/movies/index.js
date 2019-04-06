const fs = require('fs')

const fileName = __dirname + '/movies.json'

const getMovies = () => {
    const data = fs.readFileSync(fileName).toString()
    return JSON.parse(data)
}

const addMovie = (title, id) => {
    const movies = getMovies()

    if (movies.findIndex(movie => movie.id == id) != -1) return

    movies.push({ title, id })
    fs.writeFileSync(fileName, JSON.stringify(movies))
}

const removeMovie = (id) => {
    const movies = getMovies()
    const indexToDelete = movies.findIndex(movie => movie.id == id)

    if (indexToDelete == -1) throw new Error('Movie not found')

    movies.splice(indexToDelete, 1)
    fs.writeFileSync(fileName, JSON.stringify(movies))
}

module.exports = {
    getMovies,
    addMovie,
    removeMovie
}