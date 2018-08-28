let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: {type: String},
    password: {type: String},
    role: {type: String, enum: ['admin', 'deo', 'validator', 'client']}
});

let User = mongoose.model('User', userSchema);
module.exports = User;