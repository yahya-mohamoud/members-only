export function checkAuth(req, res, next) {
    
  if (req.session.data === undefined) {
    return res.redirect('/auth/login')
  }

  // Make `sessionData` available in templates. E.g. check navbar.ejs line:12
  res.locals.sessionData = req.session.data

  next()
}

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login'); // or res.status(401).send('Unauthorized');
}