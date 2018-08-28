let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let zoneSchema = new Schema({
    name: {type: String},
    cities: [{type: Schema.Types.ObjectId, ref: 'City'}]
});

let Zone = mongoose.model('Zone', zoneSchema);

module.exports = Zone;
