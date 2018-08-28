async function uploadFile(req, res) {
    res.status(200).json({file: `https://localhost/public/uploads/${req.file.filename}`});
}

module.exports = {uploadFile};