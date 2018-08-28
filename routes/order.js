let multer = require('multer');
let express = require('express');
let orderRouter = express.Router();
let {createOrder, updateOrder, getOrder, getOrders} = require('../controller/order.controller');
let {uploadFile} = require('../controller/file.controller');
let {isAuthenticated} = require('../middleware/authenticate');

const getExtension = (name)=>{
    let local = name.split('.');

    return local[local.length - 1]
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!file) {
            return;
        }
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        if (!file) {
            return;
        }
        cb(null, file.fieldname + '-' + Date.now() + `.${getExtension(file.originalname)}`)
    }
});

let upload = multer({storage});

orderRouter.post('/upload', isAuthenticated, upload.single('file'), uploadFile);

orderRouter.post('/', isAuthenticated, createOrder);
orderRouter.put('/:orderId', isAuthenticated, updateOrder);
orderRouter.get('/:orderId', isAuthenticated, getOrder);
orderRouter.get('/', isAuthenticated, getOrders);


module.exports = orderRouter;