const authenticate = (req, res, next) => {
    const password = req.header('Authorization');
    if (password === process.env.PASSWORD) next();
    else res.status(403).send();
}

module.exports = authenticate;