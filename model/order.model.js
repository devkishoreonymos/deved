let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema({
    approved: {type: String, enum: ['accepted', 'rejected', 'pending'], default: 'pending'},
    auditorId: {type: String},
    supplier: {type: String, required: true},
    date: {type: Date},
    orderId: {type: String, required: true},
    shopperName: {type: String, required: true},
    city: {type: String, required: true},
    townClass: {type: String, required: true},
    zone: {type: String, required: true},
    orderDate: {type: Date, required: true},
    dispatchDate: {type: Date, required: true},
    deliveryDate: {type: Date, required: true},
    productType: {type: String, required: true},
    productName: {type: String, required: true},
    productCategory: {type: String, required: true},
    platform: {type: String, required: true},
    batchCode: {type: String, required: true},
    mafDate: {type: Date, required: true},
    remark: {type: String},
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