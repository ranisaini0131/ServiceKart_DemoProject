import { qb } from "../../server.js"


export const getProductList = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 0; // Current page number
        const limit = parseInt(req.query.limit) || 5; // Number of items per page
        // const offset = (page - 1) * limit; //to skip


        let condition = "";

        if (req.query.category_key) {
            condition += ` AND p.product_category = '${req.query.category_key}' `;
        }

        if (req.query.key) condition += ` AND p.product_name LIKE '%${req.query.key}%' `;



        //searching on product_name gives particular product and filtering on product_category creates a list of products, category wise
        const productCategoryList = `SELECT 
                                     p.id, p.product_name, p.description, p.price, p_c.category_name,p.product_category
                                     FROM products AS p
                                     LEFT JOIN product_categories AS p_c
                                     ON p.product_category = p_c.id
                                     WHERE p.status='1' ${condition} AND user_reference_id='${req.body.user}'
                                     ORDER BY p.id DESC
                                     LIMIT ${page}, ${limit}`


        await qb.query(productCategoryList, (err, results) => {
            if (err) throw err;

            else if (results.length > 0) {
                return res.status(200).json({
                    "message": "Product List",
                    "data": results
                })
            } else {
                return res.status(404).json({
                    "message": "No Products Found",
                })
            }
        })

    } catch (error) {
        console.log("getProductList", error.message)
    }
}


export const product_details = async (req, res) => {
    try {

        const singleProduct = `SELECT 
                               id, product_name,description, price, product_category
                               FROM products
                               WHERE status='1' AND
                               id= '${req.params.id}' AND 
                               user_reference_id='${req.body.user}'`

        await qb.query(singleProduct, (err, results) => {
            if (err) throw err;
            else if (results.length == 0) {
                res.status(200).json({
                    "message": "No Product Found"
                })
            } else {
                res.status(200).json({
                    "message": "single product details",
                    "data": results
                })
            }
        })

    } catch (error) {
        console.log("product_details", error.message)

    }
}


//foreign key
export const addProductsToCart = async (req, res) => {
    try {

        const { product_reference_id, quantity } = req.body


        //add product to cart
        const addToCart = `INSERT INTO carts 
                           (product_reference_id, quantity, user_reference_id)
                           VALUES (
                           '${product_reference_id}',
                           '${quantity}',
                           '${req.body.user}')`;


        await qb.query(addToCart, (err, results) => {
            if (err) throw err;
            else if (results.length == 0) {
                res.status(500).json({
                    "message": "No Product Added To Cart"
                })
            } else {
                res.status(200).json({
                    "message": "Product Added To Cart",
                    "data": results
                })
            }
        })

    } catch (error) {
        console.log("addProductsToCart", error)

    }

}

export const updateProductStatus = async (req, res) => {
    try {

        const { status, productId } = req.body


        await qb.query(`UPDATE products 
                        SET status = '${status}'
                        WHERE id = '${productId}' AND 
                        user_reference_id = '${req.body.user}'`)

        let message;

        switch (status) {
            case 1:
                message = 'Product is active';
                break;
            case 0:
                message = 'Product is inactive';
                break;
            default:
                message = 'Product is deleted';
                break;
        }

        res.status(200).json({ message });

    } catch (error) {
        console.log("updateStatus", error)
    }
}


export const placeOrder = async (req, res) => {
    try {

        const { total_amount, shipping_address, order_details } = req.body

        //add product to cart
        const order = await qb.query(`INSERT INTO orders 
                                      (total_amount, address_reference_id, user_reference_id)
                                      VALUES(
                                      '${total_amount}', 
                                      '${shipping_address}',
                                      '${req.body.user}'
                                      )`);



        //extract order_reference_id
        const order_reference_id = order.insertId

        // //by using map we are traversing the order details array and inserting values
        // //convert array of object into array of arrray and then use insert query only once(outside the map)--improvised the code



        const values = order_details.map(order => [
            order_reference_id,
            order.product_reference_id,
            order.price,
            order.tax,
            order.quantity,
            req.body.user
        ]);



        const orderDetailQuery = `INSERT INTO order_details
                (order_reference_id,product_reference_id,price,tax,quantity,user_reference_id)
                VALUES ${values.map(arr => `(${arr.map(val => `'${val}'`).join(', ')})`).join(', ')}`


        await qb.query(orderDetailQuery, (err, results) => {
            if (err) {
                throw err;
            } else if (results.affectedRows == 0) {
                return res.status(200).json({
                    "message": "No Order Placed"
                })
            } else {
                return res.status(200).json({
                    "message": "Order Placed",
                    "data": results
                })
            }
        })


    } catch (error) {
        console.log("placeOrder", error)
    }

}


export const myOrdersList = async (req, res) => {
    try {

        const orderList = `SELECT
                           o.id, o.total_amount, a.area, a.landmark, a.latitude, a.longitude
                           FROM orders AS o
                           LEFT JOIN address AS a
                           ON o.address_reference_id = a.id
                           WHERE o.status='1' AND o.user_reference_id = '${req.body.user}'
            `

        await qb.query(orderList, (err, results) => {
            if (err) throw err;
            else if (results.length == 0) {
                res.status(200).json({
                    "message": "No Address Found"
                })
            } else {
                res.status(200).json({
                    "message": "Address List",
                    "data": results
                })
            }
        })

    } catch (error) {
        console.log("myOrdersList", error.message)
    }
}


export const order_details = async (req, res) => {
    try {
        const { id } = req.body;

        // Query to fetch order details and address
        const order_details_query_one = await qb.query(`SELECT
                                                        o.id,o.total_amount,o.order_status,o.created_at,o.address_reference_id,a.area,a.landmark,
                                                        a.latitude,a.longitude
                                                        FROM orders AS o
                                                        LEFT JOIN address AS a ON o.address_reference_id = a.id
                                                        WHERE o.id = '${id}'
                                                        AND o.user_reference_id = '${req.body.user}'`);

        // Query to fetch order items
        const order_details_query_two = `SELECT
                                         order_details.id,
                                         order_details.product_reference_id,
                                         products.product_name,
                                         order_details.price,
                                         order_details.tax,
                                         order_details.quantity
                                         FROM order_details
                                         JOIN products ON order_details.product_reference_id = products.id
                                         WHERE order_details.order_reference_id = '${id}'
                                         AND order_details.user_reference_id = '${req.body.user}'`;


        await qb.query(order_details_query_two, (err, results) => {
            if (err) throw err;
            else if (results.length > 0 && order_details_query_one.length > 0) {
                res.status(404).json({
                    message: 'Product List',
                    data: {
                        ...order_details_query_one[0],
                        order_details: results
                    }
                })
            } else {
                res.status(404).json({
                    message: 'No orders found '
                });
            }
        });

    } catch (error) {
        console.error("order_details error", error)
    }
};



export const cancelOrder = async (req, res) => {
    try {
        const { orderId, reasonOfCancellation } = req.body


        const updateStatusQuery = `UPDATE orders
                                   SET order_status = 'canceled', reason_of_cancellation = '${reasonOfCancellation}'
                                   WHERE id = '${orderId}' AND user_reference_id = '${req.body.user}'`;

        await qb.query(updateStatusQuery, (err, results) => {
            if (err) throw err;
            else if (results.affectedRows == 0) {
                return res.status(400).json({
                    "message": 'Order not found'
                });
            } else {
                res.status(200).json({
                    "message": 'Order status updated successfully'
                });
            }
        });

    } catch (error) {
        console.log("updateOrderStatus", error)
    }
}

export const updateOrdereStatus = async (req, res) => {
    try {

        const { status, orderId } = req.body


        await qb.query(`UPDATE orders 
                        SET status = '${status}'
                        WHERE id = '${orderId}' AND 
                        user_reference_id = '${req.body.user}'`)

        let message;

        switch (status) {
            case '1':
                message = 'Order is active';
                break;
            case '0':
                message = 'Order is inactive';
                break;
            default:
                message = 'Order is deleted';
                break;
        }

        res.status(200).json({ message });

    } catch (error) {
        console.log("updateStatus", error)
    }
}

