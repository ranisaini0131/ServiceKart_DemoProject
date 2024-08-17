import { qb } from "../../server.js"

//get products
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
                                                    WHERE p.status='1' ${condition} AND user_reference_id='${req.body.user}'
                                                    ORDER BY p.id DESC
                                                    LIMIT ${page}, ${limit}`)


        return res.status(200).json({
            "message": "Product List",
            "data": productCategoryList
        })

    } catch (error) {
        console.log("getProductList", error.message)
    }
}

//run
export const product_details = async (req, res) => {
    try {

        const singleProduct = await qb.query(`SELECT 
                                              product_name,description, price, product_category
                                              FROM products
                                              WHERE
                                              id= '${req.params.id}' AND 
                                              user_reference_id='${req.body.user}' 
                                              `)

        res.status(200).json({
            "message": "single product details",
            "data": singleProduct
        })

    } catch (error) {
        console.log("product_details", error.message)

    }
}


//done
export const addProductsToCart = async (req, res) => {
    try {

        const { product_reference_id, quantity } = req.body


        //add product to cart
        const addToCart = await qb.query(`INSERT INTO carts (
                                          product_reference_id, quantity, user_reference_id)
                                          VALUES (
                                          '${product_reference_id}',
                                          '${quantity}',
                                          '${req.body.user}'
                                          )`)

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
        console.log("addProductsToCart", error)

    }

}

//pending validation
export const placeOrder = async (req, res) => {
    try {

        //get user details from frontend
        const { total_amount, address_reference_id, order_details } = req.body

        //add product to cart
        const order = await qb.query(`INSERT INTO orders 
                                      (total_amount, address_reference_id, user_reference_id)
                                      VALUES(
                                      '${total_amount}', 
                                      '${address_reference_id}',
                                      '${req.body.user}'
                                      )`);


        //extract order_reference_id
        const order_reference_id = order.insertId

        //by using map we are traversing the order details array and inserting values
        //convert array of object into array of arrray and then use insert query only once(outside the map)--improvised the code
        const orderDetailQuery = order_details.map(order =>
            qb.query(`INSERT INTO order_details 
                (order_reference_id,product_reference_id,price,tax,quantity,user_reference_id)
                VALUES
                ('${order_reference_id}',
                '${order.product_reference_id}',
                '${order.price}',
                '${order.tax}', 
                '${order.quantity}',
                '${req.body.user}'
                )`)
        )

        await Promise.all(orderDetailQuery);



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
        console.log("placeOrder", error)
    }

}

//done

//every select query should have primary key of the table
//address by join
export const myOrdersList = async (req, res) => {
    try {

        const orderList = await qb.query(`SELECT id,
                                          total_amount,address_reference_id
                                          FROM orders
                                          WHERE user_reference_id='${req.body.user}'
                                          `)

        res.status(200).json({
            "message": "Address List",
            "data": orderList
        })


    } catch (error) {
        console.log("myOrdersList", error.message)
    }
}


//run
//id from body
//1st get data from order table on basis of id(order_reference_id) and then get data from details table 
export const order_details = async (req, res) => {
    try {

        console.log(`SELECT id
            product_reference_id,price,tax,quantity
            FROM orders
            WHERE user_reference_id='${req.body.user}'`)

        const order_details = await qb.query(`SELECT id,
                                          product_reference_id,price,tax,quantity
                                          FROM order_details
                                          WHERE user_reference_id='${req.body.user}'
                                         `)


        res.status(200).json({
            "message": "Product List",
            "data": order_details
        })

        // {
        //     "total_amount":345,
        //     "address_reference_id":id and complete address,
        //     "order_details":[
        //         {
        //         "product_reference_id": 49,
        //product_name also
        //         "price": 1234.4,
        //         "tax":23.55,
        //         "quantity":2
        //         }
        //     ]
        // }

    } catch (error) {
        console.log("order_details", error)
    }

}


//shipped, ontheway, delivered, canceled, orderid from id from body
//reason for vancelellation ka clumn bnana h kya == yes column
//cancel order: we can cancel 1 product either whole complete orders

export const cancelOrder = async (req, res) => {
    try {
        const { orderId, reasonOfCancellation } = req.body


        const updateStatusQuery = await qb.query(`UPDATE orders 
                                                  SET order_status ='cancel', reson_of_Cancellation='${reasonOfCancellation}'
                                                  WHERE id='${orderId}' AND user_reference_id='${req.body.user}'`);

        if (!updateStatusQuery) {
            return res.status(400).json({
                "message": 'Order not found'
            });
        } else {
            res.status(500).json({
                "message": 'Order status updated successfully'
            });
        }

    } catch (error) {
        console.log("updateOrderStatus", error)
    }
}


