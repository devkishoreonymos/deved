let multer = require('multer');
let express = require('express');
let upload = multer({dest: 'uploads/'});
let orderRouter = express.Router();
let {createOrder, updateOrder, getOrder, getOrders} = require('../controller/order.controller');
let uploadFile = require('../controller/file.controller').uploadFile;
let {isAuthenticated} = require('../middleware/authenticate');

orderRouter.post('/upload', isAuthenticated, upload.single('file'), uploadFile);

orderRouter.post('/', isAuthenticated, createOrder);
orderRouter.put('/:orderId', isAuthenticated, updateOrder);
orderRouter.get('/:orderId', isAuthenticated, getOrder);
orderRouter.get('/', isAuthenticated, getOrders);


module.exports = orderRouter;