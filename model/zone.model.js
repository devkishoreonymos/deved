let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let zoneSchema = new Schema({
    name: {type: String},
    cities: [{
        name: {type: String},
        townClass: {type: String}
    }]
});

let Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;
