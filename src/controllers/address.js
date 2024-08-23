import { qb } from "../../server.js"


export const addAddress = async (req, res) => {
    try {

        const { area, landmark, person_name, address_type, latitude, longitude } = req.body


        //insert data
        const addAddress = `INSERT INTO address 
                                           (area, landmark, person_Name, address_Type, latitude, longitude, user_reference_id)
                                           VALUES (
                                           '${area}',
                                           '${landmark}',
                                           '${person_name}',
                                           '${address_type}', 
                                           '${latitude}', 
                                           '${longitude}', 
                                           '${req.body.user}')`

        await qb.query(addAddress, (err, results) => {
            if (err) throw err;

            else if (results.length == 0) {
                return res.status(500).json({
                    status: 'error',
                    message: "something went wrong while adding the address"
                })
            } else {
                res.status(200).json({
                    "message": "address added successfully",
                    "data": results
                })
            }
        })

    } catch (error) {
        console.log("addAddress", error)
    }

}


export const addressList = async (req, res) => {
    try {

        const addressList = await qb.query(`SELECT 
                                            id, status, area, landmark, person_name, address_type, latitude, longitude
                                            FROM address
                                            WHERE status='1' AND 
                                            user_reference_id='${req.body.user}'
                                            `)

        console.log(addressList[0].status)
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



export const updateAddress = async (req, res) => {
    try {

        const { area, landmark, person_name, address_type, latitude, longitude } = req.body;


        const updateAddressData = `UPDATE address 
                                   SET
                                   area = '${area}', 
                                   landmark='${landmark}', 
                                   person_Name='${person_name}', 
                                   address_Type='${address_type}', 
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


export const updateAddressStatus = async (req, res) => {
    try {

        const { status, addressId } = req.body


        await qb.query(`UPDATE address 
                        SET status = '${status}'
                        WHERE id = '${addressId}' AND 
                        user_reference_id = '${req.body.user}'`)

        let message;

        switch (status) {
            case '1':
                message = 'Address is active';
                break;
            case '0':
                message = 'Address is inactive';
                break;
            default:
                message = 'Address is deleted';
                break;
        }

        res.status(400).json({ message });

    } catch (error) {
        console.log("updateStatus", error)
    }
}


