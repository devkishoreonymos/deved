let Order = require('../model/order.model');

async function createOrder(req, res) {
    try {
        let user = res.locals.user;
        if (user.role !== 'deo') {
            return res.status(401).json({message: 'forbidden'});
        }
        let order = new Order(req.body);
        let count = Order.count();
        order.auditorId = createAuditorId(order.city, count);
        order = await Order.create(order);
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

function createAuditorId(city, count) {
    return `AUD${city.substring(0, 3)}${count}`;
}

async function updateOrder(req, res) {
    try {
        let user = res.locals.user;
        if (user.role !== 'validator') {
            return res.status(401).json({message: 'forbidden'});
        }
        let order = await Order.findOneAndUpdate({_id: req.params.orderId}, {$set: {approved: req.query.action}});
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
            orders = await Order.find({approved: 'accepted'});
        } else {
            orders = await Order.find({});
        }

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({message: err});
    }
}

module.exports = {
    createOrder, updateOrder, getOrder, getOrders
};