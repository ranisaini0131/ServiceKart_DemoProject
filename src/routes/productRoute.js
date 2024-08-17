import Router from "express"
import { verifyJWT } from "../middleware/verifyUser.js"
import { addProductsToCart, getProductList, myOrdersList, order_details, placeOrder, product_details } from "../controllers/product.js"
import { validateSchema } from "../utilities/helperSchema.js"
import { addProductToCartValidation, placeOrderValidation } from "../middleware/validation.js"

const router = Router()


router.get("/getProduct", verifyJWT, getProductList)

router.post("/addToCart", verifyJWT, validateSchema(addProductToCartValidation), addProductsToCart)

router.post("/placeOrder", verifyJWT, placeOrder) //validateSchema(placeOrderValidation), check how to pass array in validationn

router.get("/orderList", verifyJWT, myOrdersList)

router.get("/product_details/:id", verifyJWT, product_details)

router.get("/orderDetails", verifyJWT, order_details)



export default router;