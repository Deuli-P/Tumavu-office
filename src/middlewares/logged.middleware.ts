
const isLogged = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Logged in users only' });
  }
};

export default isLogged;