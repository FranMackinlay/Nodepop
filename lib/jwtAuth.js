
// * JWT middleware verification

const jwt = require('jsonwebtoken');

module.exports = function () {
  return (req, res, next) => {

    const token = req.get('Authorization') || req.query.token || req.body.token;
    console.log(token);

    if (!token) {
      const error = new Error();
      error.message = 'Missing Token'
      error.status = 401;
      next(error);
      return;
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
