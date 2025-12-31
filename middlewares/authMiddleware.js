const isAuthenticated = (req, res, next) => {
    if (req.session.user !== undefined) {
        res.locals.user = req.session.user; // Make user available to all views
        res.locals.isAuthenticated = true;
        next()
    } else {
        return res.status(401).redirect('/account/login')
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send("Access Denied");
    }
}

export { isAdmin };
export default isAuthenticated;