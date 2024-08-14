import { qb } from "../../server.js"

//page16
export const addAddress = async (req, res) => {
    try {

        const { area, landmark, person_name, address_type, latitude, longitude, user_reference_id } = req.body


        //insert data
        const addAddress = await qb.query(`INSERT INTO address (area, landmark, person_Name, address_Type, latitude, longitude, user_reference_id) VALUES ('${area}','${landmark}','${person_name}','${address_type}', '${latitude}', '${longitude}', '${user_reference_id}')`)


        if (!addAddress) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while adding the address"
            })
        }

        res.status(200).json({
            "message": "address added successfully",
            "data": addAddress
        })

    } catch (error) {
        console.log(error.message)
        return res.status(409).json({
            status: "failed",
            message: "Address doesn't added"
        });
    }

}

//page 15
export const addressList = async (req, res) => {
    try {

        const addressList = await qb.query(`SELECT area, landmark, person_name, address_type, latitude, longitude FROM address `)

        res.status(200).json({
            "message": "Address List",
            "data": addressList
        })


    } catch (error) {
        console.log(error.message)
    }


}

//updateAddress
export const updateAddress = async (req, res) => {
    try {

        const { area, landmark, person_Name, address_Type, latitude, longitude } = req.body;


        const updateAddressData = `UPDATE address SET area = '${area}', landmark='${landmark}', person_Name='${person_Name}', address_Type='${address_Type}', latitude='${latitude}', longitude='${longitude}' WHERE user_reference_id = '${req.body.user}'`

        await qb.query(updateAddressData, async (err, results) => {

            if (err) {
                console.log(err, "283")
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
        console.log(error)
        return res
            .status(500)
            .json({
                status: "failed",
                error: error.message
            })

    }


}


//deleteAddress
export const deleteAddress = async (req, res) => {
    try {

        const deleteData = await qb.query(`SELECT status from address`)
        console.log(deleteData[0].status, "s")

        const addressStatus = deleteData[0].status

        const deleteAddressQuery = qb.query(`UPDATE address SET status = 2 WHERE id='${req.body.user}'`)

        if (addressStatus === 1) {
            res.status(400).json({
                "message": 'Address is active'
            });
        } else {
            await qb.query(deleteAddressQuery, async (err, results) => {
                if (err) {
                    console.log(err, "284")
                    return err;
                } else {
                    if (results.affectedRows <= 0) {
                        res.status(500).json({
                            "message": 'Address is not deleted'
                        });
                    } else {
                        res.status(200).json({
                            "message": 'Address deleted successfully'
                        });
                    }
                }
            })



            // if (!deleteData) {
            //     return res.status(500).json({
            //         status: 'error',
            //         message: "something went wrong while deleting the address"
            //     })
            // }

            // res.status(200).json({
            //     "message": "address deleted successfully",
            //     "data": deleteData
            // })
        }
    } catch {
        console.log(error)
        return res
            .status(500)
            .json({
                status: "failed",
                error: error.message
            })
    }
}