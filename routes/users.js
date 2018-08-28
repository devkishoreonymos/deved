let express = require('express');
let userRouter = express.Router();
let userSignIn = require('../controller/user.controller').userSignIn;

/* GET users listing. */
userRouter.post('/', userSignIn);

module.exports = userRouter;
