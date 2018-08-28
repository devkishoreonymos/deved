let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let citySchema = new Schema({
    name: {type: String},
    townClass: {type: String},
    zone: {type: String}
});

let City = mongoose.model('City', citySchema);

module.exports = City;
