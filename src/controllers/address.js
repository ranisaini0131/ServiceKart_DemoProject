import { qb } from "../../server.js"

//page16
export const addAddress = async (req, res) => {
    try {

        const { area, landmark, person_name, address_type, latitude, longitude, user_reference_id } = req.body


        //insert data
        const addAddress = await qb.query(`INSERT INTO address 
                                           (area, landmark, person_Name, address_Type, latitude, longitude, user_reference_id)
                                           VALUES (
                                           '${area}',
                                           '${landmark}',
                                           '${person_name}',
                                           '${address_type}', 
                                           '${latitude}', 
                                           '${longitude}', 
                                           '${user_reference_id}')`)


        if (!addAddress) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while adding the address"
            })
        } else {
            res.status(200).json({
                "message": "address added successfully",
                "data": addAddress
            })
        }

    } catch (error) {
        console.log("addAddress", error)
    }

}

//page 15
export const addressList = async (req, res) => {
    try {

        const addressList = await qb.query(`SELECT 
                                            area, landmark, person_name, address_type, latitude, longitude
                                            FROM address
                                            WHERE user_reference_id='${req.body.user}'
                                            `)

        if (!addressList) {
            res.status(200).json({
                "message": "Address List Not found",
            })
        } else {
            res.status(200).json({
                "message": "Address List",
                "data": addressList
            })
        }

    } catch (error) {
        console.log("addressList", error)
    }
}


//updateAddress
export const updateAddress = async (req, res) => {
    try {

        const { area, landmark, person_Name, address_Type, latitude, longitude } = req.body;


        const updateAddressData = `UPDATE address 
                                   SET
                                   area = '${area}', 
                                   landmark='${landmark}', 
                                   person_Name='${person_Name}', 
                                   address_Type='${address_Type}', 
                                   latitude='${latitude}', 
                                   longitude='${longitude}' 
                                   WHERE user_reference_id = '${req.body.user}'`

        await qb.query(updateAddressData, async (err, results) => {

            if (err) {
                return err;
            } else {
                if (results.affectedRows <= 0) {
                    res.status(500).json({
                        "message": 'Address is not updated'
                    });
                } else {
                    res.status(200)
                        .json({
                            message: 'Address updated successfully'
                        });
                }
            }

        })

    } catch (error) {
        console.log("updateAddress", error)

    }


}


//updateAddress
//sir se check
export const updateStatus = async (req, res) => {
    try {

        const { status } = req.body

        // const statusQuery = await qb.query(`SELECT status, id 
        //                                     FROM address`)


        await qb.query(`UPDATE address 
                                SET status = '${status}'
                                WHERE id = '${addressId}' AND 
                                user_reference_id='${req.body.user}'`)

        res.status(400).json({
            "message": 'Address is deleted'
        });

    } catch (error) {
        console.log("updateStatus", error)
    }
}

