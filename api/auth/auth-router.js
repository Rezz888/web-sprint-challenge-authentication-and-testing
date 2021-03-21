const router = require('express').Router();
const bcrypt = require("bcryptjs");
const model = require("./users-model")

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
 router.post("/register", async (req, res, next) => {
   try {  
      const { username, password } = req.body
      const user = await model.findBy({ username }).first()

           if (user) {
             return res.status(409).json({
               message: "Username is already taken",
             })
           }
      const newUser = await model.add({
          username,
          password: await bcrypt.hash(password, 8),
      })
        
      res.status(201).json(newUser)

   } catch (err){
     next(err)
   }
   
});


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
    router.post('/login', async (req, res, next) => {
      try {
         const { username, password } = req.body
          const user = await model.findBy(( {username })).first()

          const passwordValid = await bcrypt.compare(password, user ? user.password : "") 

          if (!user || !passwordValid) {
            return res.status(401).json({
              message: "Invalid credentials",
            })
          }

          // generates a new session for this user,
		      // and sends back a session id to the client
		      req.session.user = user

          res.json({
            message: `Welcome ${user.username}`
          })

      } catch(err){
        next(err)
      }

    })

module.exports = router;
