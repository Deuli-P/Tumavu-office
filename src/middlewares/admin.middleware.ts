


const isAdmin = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.type === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Admins only' });
  }
};

export default isAdmin;