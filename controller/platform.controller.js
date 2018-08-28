let Platform = require('../model/platform.model');

async function getPlatforms(req, res) {
    try {
        let platforms = await Platform.find({});
        if (!platforms) {
            return res.status(404).json({
                message: 'Platforms not found'
            })
        }

        return res.status(200).json(platforms);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
}

module.exports = {getPlatforms};