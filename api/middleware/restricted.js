const jwt = require("jsonwebtoken")
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

      function restrict() {
        return async (req, res, next) => {
          try { 
           const token = req.headers.authorization
           if (!token){
            return res.status(403).json({
              message: "token required",
            })
          }

          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            //token didn't verify, something is wrong with it, don't trust it
            if (err) {
                return res.status(401).json({
                    message: "token invalid",
                })
            }
            // make the tokens payload available to later middleware functions
            // just in case it's needed for anything
            req.token = decoded
       
            next()

          })

          } catch (err) {
            next(err)
          }
        }
      }

      module.exports = {
        restrict,
      }
      