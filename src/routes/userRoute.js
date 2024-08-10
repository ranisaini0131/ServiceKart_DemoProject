import { Router } from "express";
import { uploads } from "../middleware/multer.js";
import { loginUser, phone_number_validation } from "../middleware/validation.js";
import { validateSchema } from "../utilities/helperSchema.js";
import { login, signup, check_phone_number, updateUserProfile } from "../controllers/user.js";
import { verifyJWT } from "../middleware/verifyUser.js";

const router = Router()


router.post("/check_phone_number", validateSchema(phone_number_validation), check_phone_number)
router.post("/signup",
    uploads.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),

    signup)

router.post("/login",
    validateSchema(loginUser),
    login)

router.patch("/updateUserProfile", verifyJWT, uploads.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), updateUserProfile)



export default router


