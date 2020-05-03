
// * JWT middleware verification

const jwt = require('jsonwebtoken');

module.exports = function () {
  return (req, res, next) => {

    const token = req.get('Authorization') || req.query.token || req.body.token;
    console.log(token);

    if (!token) {
      const error = new Error('Missing token');
      error.status = 401;
      return next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        const error = new Error('Invalid Tokken');
        error.status = 401;
        return next(error);
      }

      req.apiAuthUserID = payload._id;
      next();
    });
  };
};
