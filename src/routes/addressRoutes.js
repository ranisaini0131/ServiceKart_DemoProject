import Router from "express"
import { validateSchema } from "../utilities/helperSchema.js";
import { verifyJWT } from "../middleware/verifyUser.js";
import { addAddressValidation, updateAddressValidation, deleteAddressValidation } from "../middleware/validation.js";
import { addAddress, addressList, updateAddress, deleteAddress } from "../controllers/address.js"

const router = Router();

router.post("/addAddress", verifyJWT, validateSchema(addAddressValidation), addAddress)

router.get("/addressList", verifyJWT, addressList)

router.patch("/updateAddress", verifyJWT, validateSchema(updateAddressValidation), updateAddress)

router.delete("/deleteAddress", verifyJWT, validateSchema(deleteAddressValidation), deleteAddress)


export default router;