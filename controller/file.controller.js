async function uploadFile(req, res) {
    res.status(200).json({file: `public/uploads/${req.file.filename}`});
}

module.exports = {uploadFile};