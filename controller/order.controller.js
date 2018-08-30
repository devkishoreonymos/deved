let Order = require('../model/order.model');
let City = require('../model/city.model');
let XLSX = require('xlsx');
let fs = require('fs');
let path = require('path');

async function createOrder(req, res) {
    try {
        let user = res.locals.user;
        if (user.role !== 'deo') {
            return res.status(401).json({message: 'forbidden'});
        }

        let count = await Order.countDocuments();

        req.body = JSON.parse(req.body.data);
        console.log(count, req.body);

        let city = await City.findOne({name: req.body.city});

        console.log(count, req.body);

        req.body.townClass = city.townClass;
        req.body.auditorId = createAuditorId(req.body.city, count);
        let order = await Order.create(req.body);
        res.status(200).json(order);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
    }
}

function createAuditorId(city, count) {
    return `AUD${city.substring(0, 3).toUpperCase()}${count}`;
}

async function updateOrder(req, res) {
    try {
        let user = res.locals.user;
        if (user.role !== 'validator' && user.role !== 'deo') {
            return res.status(401).json({message: 'forbidden'});
        }

        let order;
        if (user.role === 'validator') {
            order = await Order.findOneAndUpdate({_id: req.params.orderId}, {$set: {approved: req.body.approved, remark: req.body.remark}});
        } else {

            let data = JSON.parse(req.body.data);
            order = await Order.findOneAndUpdate({_id: req.params.orderId}, data);
        }
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

async function getOrder(req, res) {
    try {
        let order = await Order.findOne({_id: req.params.orderId});
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

async function getOrders(req, res) {
    try {
        let user = res.locals.user;

        let orders;
        if (user.role === 'client') {
            req.query.approved = 'accepted';
            orders = await Order.find(req.query);
        } else {
            orders = await Order.find(req.query);
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

async function getOrdersInExcel(req, res) {
    try {
        let user = res.locals.user;

        let orders;
        if (user.role === 'client') {
            req.query.approved = 'accepted';
            orders = await Order.find(req.query, '-_id -__v -approved');
        } else {
            orders = await Order.find(req.query, '-_id -__v');
        }

        let mapped = [];
        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].questionnaire.length; j++) {
                orders[`${orders[i].questionnaire[j].qno}: ${orders[i].questionnaire[j].question}`] =
                    `${orders[i].questionnaire[j].answer}`;
                orders[`${orders[i].questionnaire[j].qno}: pic`] = `${orders[i].questionnaire[j].file}`;
                orders[`${orders[i].questionnaire[j].qno}: remark`] = `${orders[i].questionnaire[j].remark}`;
            }

            let temp = orders[i].toObject();
            delete temp.questionnaire;
            mapped.push(temp);
        }

        let ws = XLSX.utils.json_to_sheet(mapped, {header: Object.keys(mapped[0])});

        if (!fs.existsSync('public/reports')) {
            fs.mkdirSync('public/reports');
        }

        let outputfile = `public/reports/report-${Date.now()}.csv`;
        let stream = XLSX.stream.to_csv(ws);
        stream.pipe(fs.createWriteStream(outputfile));

        stream.on('end', () => {
            res.status(200).json({file: outputfile})
        })

    } catch (err) {
        console.log(err);
        res.status(200).json({message: err});
    }
}

async function getOrdersStat(req, res) {
    try {
        let countOrders = await Order.countDocuments();
        let pendingOrders = await Order.find({approved: 'pending'});
        let acceptedOrders = await Order.find({approved: 'accepted'});
        let rejectedOrders = await Order.find({approved: 'rejected'});

        return res.status(200).json({
            total: countOrders,
            pending: pendingOrders.length,
            accepted: acceptedOrders.length,
            rejected: rejectedOrders.length
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({message: err});
    }
}

module.exports = {
    createOrder, updateOrder, getOrder, getOrders, getOrdersInExcel, getOrdersStat
};