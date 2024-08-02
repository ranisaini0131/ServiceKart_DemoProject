import { Router } from "express";
import { login, signup, check_phone_number } from "../controllers/user.js";

const router = Router()


router.post("/check_phone_number", check_phone_number)
router.post("/signup", signup)
router.post("/login", login)













export default router


