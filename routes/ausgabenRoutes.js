const express = require('express');
const router = express.Router();
const ausgabenController = require('../controllers/ausgabenController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(ausgabenController.getAllAusgaben)
    .post(ausgabenController.createNewAusgaben)
    .patch(ausgabenController.updateAusgaben)
    .delete(ausgabenController.deleteAusgaben)

module.exports = router