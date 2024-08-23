import Router from "express"
import { validateSchema } from "../utilities/helperSchema.js";
import { verifyJWT } from "../middleware/verifyUser.js";
import { addAddressValidation, updateAddressStatusValidation, updateAddressValidation } from "../middleware/validation.js";
import { addAddress, addressList, updateAddress, updateAddressStatus } from "../controllers/address.js"

const router = Router();

router.post("/addAddress", verifyJWT, validateSchema(addAddressValidation), addAddress)

router.get("/addressList", verifyJWT, addressList)

router.patch("/updateAddress", verifyJWT, validateSchema(updateAddressValidation), updateAddress)

router.patch("/updateStatus", verifyJWT, validateSchema(updateAddressStatusValidation), updateAddressStatus)



export default router;