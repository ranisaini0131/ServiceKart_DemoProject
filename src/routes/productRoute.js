import Router from "express"
import { verifyJWT } from "../middleware/verifyUser.js"
import { addProductsToCart, getProductList, placeOrder } from "../controllers/product.js"
import { validateSchema } from "../utilities/helperSchema.js"
import { addProductToCartValidation, placeOrderValidation } from "../middleware/validation.js"

const router = Router()


router.get("/getProduct", verifyJWT, getProductList)

router.post("/addToCart", verifyJWT, validateSchema(addProductToCartValidation), addProductsToCart)

router.post("/placeOrder", verifyJWT, validateSchema(placeOrderValidation), placeOrder)



export default router;