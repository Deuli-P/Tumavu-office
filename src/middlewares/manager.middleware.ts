

const isManager = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.type === 'MANAGER') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Managers only' });
  }
};

export default isManager;