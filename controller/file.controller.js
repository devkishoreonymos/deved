async function uploadFile(req, res) {
    return res.status.json({file: `https://crm.digidu.in/uploads/${req.file.originalname}`});
}

module.exports = {uploadFile};