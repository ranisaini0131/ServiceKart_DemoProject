import { qb } from "../../server.js"

//get products
export const getProductList = async (req, res) => {
    try {

        const addressList = await qb.query(`SELECT * FROM products`)

        res.status(200).json({
            "message": "Address List",
            "data": addressList
        })


    } catch (error) {
        console.log(error.message)
    }
}


//page 31
//to add we should have products, create products?
export const addProductsToCart = async (req, res) => {
    try {
        //get user details from frontend
        const { product_reference_id, quantity, user_reference_id } = req.body

        //validation
        if (!(product_reference_id || quantity || user_reference_id)) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }

        //add product to cart
        const addToCart = await qb.query(`INSERT INTO cart (product_reference_id, quantity, user_reference_id) VALUES ('${product_reference_id}','${quantity}','${user_reference_id}')`)

        if (!addToCart) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while adding products to cart"
            })
        }

        res.status(200).json({
            "message": "products added to cart succesfully",
            "data": addToCart
        })



    } catch (error) {
        console.log("error:", error)
        return res.status(409).json({
            status: "failed",
            message: "products doesn't added to cart"
        });

    }

}


export const placeOrder = async (req, res) => {
    try {

        //get user details from frontend
        const { product_reference_id, price, tax, shipping_address, user_reference_id } = req.body

        //validation
        if (!(product_reference_id || price || tax || shipping_address || user_reference_id)) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }

        const total_pay_amount = price + tax

        //add product to cart
        const order = await qb.query(`INSERT INTO order (product_reference_id,price, tax, total_amount, shipping_address user_reference_id) VALUES ('${product_reference_id}','${price}','${tax}',''${total_pay_amount}',${shipping_address}','${user_reference_id}')`)

        console.log(order)

        if (!order) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while placing the order"
            })
        }

        res.status(200).json({
            "message": "order placed succesfully",
            "data": order
        })

    } catch (error) {
        console.log("error:", error)
        return res.status(409).json({
            status: "failed",
            message: "order doesn't placed"
        });
    }

}

//page 34
//display all orders
export const myOrdersList = async (req, res) => {
    try {

        const orderList = await qb.query(`SELECT * FROM order`)

        res.status(200).json({
            "message": "Address List",
            "data": orderList
        })


    } catch (error) {
        console.log(error.message)
    }
}



//page 33
export const paymentOptions = async (req, res) => {



}



//Addtocart= 1product= 2, quantity
//orderplace=items, quantity, price, totalAmount, delivery Address, userId

