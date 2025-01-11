export const isTeacher = (req, res, next) => {
    try {
      if (!req.user || req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Only teachers can perform this action.' });
      }
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  