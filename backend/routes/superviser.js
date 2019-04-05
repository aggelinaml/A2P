'using strict';
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const processCtrl = require('../controllers/process');
const applicantCtrl = require('../controllers/applicant');
const superviserCtrl = require('../controllers/superviser');

router.get('/processes', auth, processCtrl.getAllProcesses);
router.get('/process/:processId', auth, processCtrl.getProcessById);
router.put('/process/:processId', auth, processCtrl.updateProcessById);
router.put('/open/process/:processId', auth, processCtrl.openProcessById);
router.post('/create/process/', auth, processCtrl.createEmptyProcess);
router.delete('/delete/process/:processId', auth, processCtrl.deleteProcessById);
router.post('/copy/process/:processId', auth, processCtrl.copyProcessById);
router.post('/signin', auth, superviserCtrl.createSuperviser);
router.post('/login', superviserCtrl.loginSuperviser);

module.exports = router;
