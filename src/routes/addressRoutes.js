import Router from "express"
import { validateSchema } from "../utilities/helperSchema.js";
import { verifyJWT } from "../middleware/verifyUser.js";
import { addAddressValidation, updateAddressValidation } from "../middleware/validation.js";
import { addAddress, addressList, updateAddress, updateStatus } from "../controllers/address.js"

const router = Router();

router.post("/addAddress", verifyJWT, validateSchema(addAddressValidation), addAddress)

router.get("/addressList", verifyJWT, addressList)

router.patch("/updateAddress", verifyJWT, validateSchema(updateAddressValidation), updateAddress)

router.patch("/updateStatus", verifyJWT, updateStatus)



export default router;