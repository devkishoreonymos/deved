async function uploadFile(req, res) {
    res.status(200).json({file: `http://13.232.237.19/public/uploads/${req.file.filename}`});
}

module.exports = {uploadFile};