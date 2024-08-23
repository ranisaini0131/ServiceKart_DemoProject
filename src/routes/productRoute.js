import Router from "express"
import { verifyJWT } from "../middleware/verifyUser.js"
import { addProductsToCart, cancelOrder, getProductList, myOrdersList, order_details, placeOrder, product_details, updateOrdereStatus, updateProductStatus } from "../controllers/product.js"
import { validateSchema } from "../utilities/helperSchema.js"
import { addProductToCartValidation, cancelOrderValidation, placeOrderValidation, updateOrderStatusValidation, updateProductStatusValidation } from "../middleware/validation.js"

const router = Router()


router.get("/getProduct", verifyJWT, getProductList)

router.post("/addToCart", verifyJWT, validateSchema(addProductToCartValidation), addProductsToCart)

router.post("/placeOrder", verifyJWT, validateSchema(placeOrderValidation), placeOrder)

router.patch("/updateProductStatus", verifyJWT, validateSchema(updateProductStatusValidation), updateProductStatus)

router.get("/orderList", verifyJWT, myOrdersList)

router.get("/product_details/:id", verifyJWT, product_details)

router.get("/orderDetails", verifyJWT, order_details)

router.patch("/cancelOrder", verifyJWT, validateSchema(cancelOrderValidation), cancelOrder)

router.patch("/updateOrdereStatus", verifyJWT, validateSchema(updateOrderStatusValidation), updateOrdereStatus)

router.patch("/updateProductStatus", verifyJWT, validateSchema(updateProductStatusValidation), updateProductStatus)


export default router;