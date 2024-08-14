import { qb } from "../../server.js"

//get products
//add user_reference_id='${req.body.user}'
export const getProductList = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 0; // Current page number
        const limit = parseInt(req.query.limit) || 5; // Number of items per page
        // const offset = (page - 1) * limit; //to skip

        let condition = "";
        if (req.query.key) condition += ` AND p.product_name LIKE '%${req.query.key}%' `;
        console.log(condition)

        if (req.query.category_key) {
            condition += ` AND p.product_category = '${req.query.category_key}' `;
        }


        //searching on product_name gives particular product and filtering on product_category creates a list of products, category wise
        const productCategoryList = await qb.query(`SELECT p.id, p.product_name, p.description, p.price, p_c.category_name
                                                   FROM products AS p
                                                   LEFT JOIN product_categories AS p_c
                                                    ON p.product_category = p_c.id
                                                    WHERE p.status='1' ${condition}
                                                    ORDER BY p.id DESC
                                                    LIMIT ${page}, ${limit}`)


        return res.status(200).json({
            "message": "Product List",
            "data": productCategoryList
        })



    } catch (error) {
        console.log(error.message)
    }
}


export const product_details = async (req, res) => {
    try {


        const singleProduct = await qb.query(`SELECT product_name,description, price, product_category FROM products WHERE id= '${req.params.id}' AND user_reference_id='${req.body.user}' `)

        res.status(200).json({
            "message": "single product details",
            "data": singleProduct
        })

    } catch (error) {
        //add function_name
        console.log(error.message)

    }
}


//page 31
export const addProductsToCart = async (req, res) => {
    try {
        //get user details from frontend
        const { product_reference_id, quantity } = req.body

        //validation
        if (!(product_reference_id || quantity)) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }

        //add product to cart
        const addToCart = await qb.query(`INSERT INTO carts (product_reference_id, quantity, user_reference_id) VALUES ('${product_reference_id}','${quantity}','${req.body.user}')`)

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
        const { product_reference_id, price, tax, shipping_address } = req.body

        //validation
        if (!(product_reference_id || price || tax || shipping_address)) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }

        const total_pay_amount = price + tax

        //add product to cart
        const order = await qb.query(`INSERT INTO orders (product_reference_id, price, tax, total_amount, shipping_address, user_reference_id) VALUES('${product_reference_id}', '${price}', '${tax}', '${total_pay_amount}', '${shipping_address}', '${req.body.user}')`);

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

        const orderList = await qb.query(`SELECT price,tax,total_amount,shipping_address FROM orders`)

        res.status(200).json({
            "message": "Address List",
            "data": orderList
        })


    } catch (error) {
        console.log(error.message)
    }
}

//sir
//placeorder se order table me chl agy data but order_details table seperate h usme kese aaega 
//order table me 1 order ki 1 id but order_details is for multiple orders......
export const order_details = async (req, res) => {
    try {

        //have to insert manually into order_details table
        const order_id = req.params.order_id

        const order_details = await qb.query(`SELECT product_reference_id, order_reference_id, price,tax,total_amount,shipping_address FROM order_details WHERE id='${req.params.id}' AND user_reference_id='${req.body.user}'`)

        res.status(200).json({
            "message": "Product List",
            "data": order_details
        })

    } catch (error) {
        console.log(error.message)
    }

}


export const cancelOrder = async (req, res) => {
    try {

    } catch (error) {

    }

}


//page 33
export const paymentOptions = async (req, res) => {

}


//product :addSearch in product list api +pagination +filter basisof category


//cancel order: we can cancel 1 product either whole complete orders
