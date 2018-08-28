let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema({
    approved: {type: String, enum: ['accepted', 'rejected', 'required'], default: 'required'},
    auditorId: {type: String},
    supplier: {type: String},
    date: {type: Date},
    orderId: {type: String},
    shopperName: {type: String},
    city: {type: String},
    townClass: {type: String},
    zone: {type: String},
    orderDate: {type: Date},
    dispatchDate: {type: Date},
    deliveryDate: {type: Date},
    productType: {type: String},
    productName: {type: String},
    productCategory: {type: String},
    platform: {type: String},
    batchCode: {type: String},
    mafDate: {type: Date},
    questionnaire: [{
        qno: {type: Number},
        question: {type: String},
        answer: {type: String},
        remark: {type: String},
        file: {type: String}
    }]
});

let Order = mongoose.model('Order', orderSchema);
module.exports = Order;