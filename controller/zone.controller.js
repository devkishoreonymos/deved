let Zone = require('../model/zone.model');

async function getZones(req, res) {
    try {
        let zone =  await Zone.findOne({"name": req.params.name}).populate([{path: 'cities'}]);
        if (!zone) {
            return res.status(404).json({message: 'Zones not found'});
        }

        return res.status(200).json(zone.cities);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
}

module.exports = {getZones};
