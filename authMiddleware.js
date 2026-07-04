function authMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({
            message: "you are not logged in",
        });
    }

    const decoded = jwt.verify(token, "secret key");
    const username = decoded.username;

    if (!username) {
        return res.status(403).json({
            message: "malformed jwt token",
        });
    }

    req.username = username;
    next();
}

module.exports = authMiddleware;
