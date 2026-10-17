const express = require('express');
const router = express.Router();
const { getDoctors, createDoctor, deleteDoctor } = require('../controllers/doctorController');

router.get('/', getDoctors);
router.post('/', createDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;
