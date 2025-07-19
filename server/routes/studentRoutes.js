const express = require("express")
const router = express.Router()
const studentController = require("../controllers/studentController")
const verifyTokenMiddleware = require("../middleware/verifyTokenMiddleWare");

router.post("/login", studentController.Login)
router.post("/signup", studentController.Signup)
router.get("/" , verifyTokenMiddleware , studentController.getStudent)
router.get("/get-course" , verifyTokenMiddleware , studentController.getCourseDetails)
router.post("/set-course" , verifyTokenMiddleware , studentController.setCourse)
router.get("/get-course-details", verifyTokenMiddleware , studentController.getCourse) 
router.post("/evaluate-problem" , verifyTokenMiddleware , studentController.checkCompleted)
router.post("/set-platform" , verifyTokenMiddleware , studentController.setPlatform)
router.get("/get-coding" , verifyTokenMiddleware , studentController.getCoding)
router.post("/check-coding" , verifyTokenMiddleware , studentController.checkCodingCompleted)
 
  
module.exports = router        