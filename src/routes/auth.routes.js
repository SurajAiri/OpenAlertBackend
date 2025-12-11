import express from "express";
import AuthController from "../controllers/auth.controller.js";
const router = express.Router();

// router.post("/google", AuthController.googleAuth);
// router.get("/dummy-login", AuthController.dummyLogin);

router.post("/email/register", AuthController.emailRegister);
router.post("/email/login", AuthController.emailLogin);

export default router;
