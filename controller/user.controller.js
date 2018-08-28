let User = require('../model/user.model');
let encrypt = require('../middleware/jwt.config').encrypt;

async function userSignIn(req, res) {
    try {
        let {userId, password} = req.body;

        let user = await User.findOne({userId, password});

        if (!user) {
            return res.status(400).json({message: 'Invalid Credentials'});
        } else {
            res.status(200).json({
                user: user,
                token: encrypt(user._id)
            })
        }
    } catch (err) {
        res.status(500).json({message: err});
    }
}

module.exports = {userSignIn};