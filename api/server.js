const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { restrict } = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');
const session = require("express-session")
const knexSessionStore = require("connect-session-knex")(session)
const db = require("../data/dbConfig")

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
    resave: false, //avoid recreating sessions that have not changed
    saveUninitialized: false, //for laws against setting cookies automatically
    secret: "keep it secret keep it safe", //cryptographically sign the session cookie
    store: new knexSessionStore({
        knex: db,  //pass configured instance of knex
        createtable: true, //if the session table does not exist, create it
      })
    

 
}))


server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict(), jokesRouter); // only logged-in users should have access!

module.exports = server;
