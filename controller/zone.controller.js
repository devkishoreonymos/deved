let Zone = require('../model/zone.model');

async function getZones(req, res) {
    try {
        let zones = Zone.find({}).populate([{path: 'cities'}]);
        if (!zones) {
            return res.status(404).json({message: 'Zones not found'});
        }

        return res.status(200).json(zones);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
}

module.exports = {getZones};
