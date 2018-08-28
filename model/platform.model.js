let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let platformSchema = new Schema({
    name: {type: String},
    sellers: [{type: String}]
});

let Platform = mongoose.model('Platform', platformSchema);

module.exports = Platform;