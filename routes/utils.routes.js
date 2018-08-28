let express = require('express');
let router = express.Router();

let {getZones} = require('../controller/zone.controller');
let {getPlatforms} = require('../controller/platform.controller');

router.get('/zones/:name', getZones);
router.get('/platforms', getPlatforms);

module.exports = router;