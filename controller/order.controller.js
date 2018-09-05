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
            let temp = orders[i].toObject();

	    temp.date = formatDate(temp.date);
            temp.orderDate = formatDate(temp.orderDate);
            temp.dispatchDate = formatDate(temp.dispatchDate);
            temp.deliveryDate = formatDate(temp.deliveryDate);
	    temp.mafDate = formatDate(temp.mafDate);
            
	    for (let j = 0; j < temp.questionnaire.length; j++) {
                temp[`${temp.questionnaire[j].qno}: ${temp.questionnaire[j].question}`] =
                    temp.questionnaire[j].answer ? `${temp.questionnaire[j].answer}`: 'NA';
                temp[`${temp.questionnaire[j].qno}: pic`] = temp.questionnaire[j].file ? `${temp.questionnaire[j].file}`: 'NA';
                temp[`${temp.questionnaire[j].qno}: remark`] = temp.questionnaire[j].remark ? `${temp.questionnaire[j].remark}`: 'NA';
            }


            delete temp.questionnaire;
            mapped.push(temp);
        }
	
	if (mapped.length === 0) {
		return res.status(404).json({message: "Not found"})
	}
        let ws = XLSX.utils.json_to_sheet(mapped, {header: Object.keys(mapped[0])});

        if (!fs.existsSync('public/reports')) {
            fs.mkdirSync('public/reports');
        }

        let outputfile = `public/reports/report-${Date.now()}.csv`;
        let stream = XLSX.stream.to_csv(ws);
        stream.pipe(fs.createWriteStream(outputfile));

        stream.on('end', () => {
            res.status(200).json({file: `http://13.232.237.19/${outputfile}`});
        })

    } catch (err) {
        console.log(err);
        res.status(200).json({message: err});
    }
}

function formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return year + '-' + month + '-' + dt;
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
