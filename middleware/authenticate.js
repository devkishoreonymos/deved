let User = require('../model/user.model');
let decrypt = require('./jwt.config').decrypt;

async function isAuthenticated(req, res, next) {
    try {
        let payload = decrypt(req);
        let user = await User.findOne({_id: payload});
        if (!user) {
            return res.status(404).json({message: "user not found"});
        }
        res.locals.user = user;
        next();
    } catch (err) {
        res.status(403).json({message: "UnAuthorized"});
    }
}

module.exports = {isAuthenticated};