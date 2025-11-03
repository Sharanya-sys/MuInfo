const express = require('express');
const router = express.Router();
const multer = require('multer');
const scanController = require('../controllers/scanController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), scanController.recognizeArtwork);

module.exports = router;