const authenticate = (req, res, next) => {
    return next()
    if (req.body.secret == 'authenticate for me') {
        next()
    } else {
        res.status(401).send()
    }
}

module.exports = authenticate