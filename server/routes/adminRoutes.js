const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const verifyTokenMiddleware = require("../middleware/verifyTokenMiddleWare");

router.get("/get-admin", verifyTokenMiddleware, adminController.getAdmin);
router.post("/admin-signup", adminController.adminSignup);
router.post("/admin-signin", adminController.adminSignin);
router.post("/add-trainer", verifyTokenMiddleware, adminController.addTrainer);
router.get(
  "/get-all-trainers",
  verifyTokenMiddleware,
  adminController.getAllTrainers
);
router.put(
  "/edit-trainer",
  verifyTokenMiddleware,
  adminController.updateTrainer
);
router.delete(
  "/delete-trainer",
  verifyTokenMiddleware,
  adminController.deleteTrainer
);
router.get("/get-admins", verifyTokenMiddleware, adminController.getAdmins);
router.delete(
  "/delete-admin",
  verifyTokenMiddleware,
  adminController.deleteAdmin
);

router.post("/add-college", verifyTokenMiddleware, adminController.addCollege);
router.get("/get-all-colleges", adminController.getAllColleges);
router.post(
  "/delete-college",
  verifyTokenMiddleware,
  adminController.deleteCollege
);

router.post("/add-program", verifyTokenMiddleware, adminController.addProgram);
router.get(
  "/get-all-programs",
  verifyTokenMiddleware,
  adminController.getAllPrograms
);
router.delete(
  "/delete-task",
  verifyTokenMiddleware,
  adminController.deleteTask
);
router.post("/add-task", verifyTokenMiddleware, adminController.addTask);
router.post(
  "/edit-program",
  verifyTokenMiddleware,
  adminController.editProgram
);
router.delete(
  "/delete-program",
  verifyTokenMiddleware,
  adminController.deleteProgram
);
router.get(
  "/get-all-problems",
  verifyTokenMiddleware,
  adminController.getAllProblems
);
router.post("/add-problem", verifyTokenMiddleware, adminController.addProblem);
router.post(
  "/create-category",
  verifyTokenMiddleware,
  adminController.addCategory
);
router.post(
  "/delete-category",
  verifyTokenMiddleware,
  adminController.deleteCategory
);

router.post(
  "/edit-problem",
  verifyTokenMiddleware,
  adminController.editProblem
);

router.post(
  "/delete-problem",
  verifyTokenMiddleware,
  adminController.deleteProblem
);

router.post(
  "/reset-trainer-password",
  verifyTokenMiddleware,
  adminController.resetTrainerPassword
);

module.exports = router;
