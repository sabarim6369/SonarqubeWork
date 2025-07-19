const trainerController = require('../controllers/trainerController');
const express = require('express');
const verifyTokenMiddleware = require('../middleware/verifyTokenMiddleWare');
const router = express.Router();

router.post("/trainer-login", trainerController.trainerLogin)
router.get("/get-trainer", trainerController.getTrainer)
router.get("/trainer-data", trainerController.getTrainerData)
router.post("/mark-task-completed", trainerController.markTaskCompleted)
router.post("/mark-attendance", trainerController.markAttendance)
router.post("/reset-password", trainerController.resetPassword)
router.post("/update-passwordforfirsttime", trainerController.changepasswordfirsttime)
router.get("/getprogramdata",trainerController.getprogramdata);
router.post("/addtask",trainerController.addtask);
router.post("/edittask",trainerController.editTask);
router.delete("/deletetask",trainerController.deleteTask);
router.post('/manual-task', trainerController.createManualTask);
router.post('/editmanual-task', trainerController.editManualTask);
router.post("/changepassword",trainerController.changepassword);
router.get("/allstudents",trainerController.getstudents);
router.put('/edit-trainer/:trainerId', trainerController.editTrainerData); // or /edit-trainer/:trainerId
router.post('/getmanualtasks',trainerController.getmanualtasks);
router.post("/runcode",trainerController.compilercode)
router.delete("/deletemanualtask/:programid/:taskid",trainerController.deletemanualtask);
module.exports = router 