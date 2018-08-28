let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let platformSchema = new Schema({
    name: {String},
    sellers: [{type: String}]
});

let Platform = mongoose.Model('Platform', platformSchema);

module.exports = Platform;