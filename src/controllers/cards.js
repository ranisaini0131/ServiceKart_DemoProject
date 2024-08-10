import { qb } from "../../server.js"

//page 17
//how to take card details 
export const addCards = async (req, res) => {
    try {

        const { card_number, cvv, card_type, valid_upto, person_name, user_reference_id } = req.body
        console.log(req.body)

        //insert data
        const addCards = await qb.query(`INSERT INTO address (card_number,cvv, card_type, valid_upto, person_name, user_reference_id) VALUES ('${card_number}','${cvv}','${card_type}','${valid_upto}', '${person_name}','${user_reference_id}')`)


        if (!addCards) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while adding the cards"
            })
        }

        res.status(200).json({
            "message": "address added successfully",
            "data": addCards
        })

    } catch (error) {
        console.log(error.message)
        return res.status(409).json({
            status: "failed",
            message: "Cards doesn't added"
        });
    }


}

//page18
export const savedCardsList = async (req, res) => {

    try {

        const savedCards = await qb.query(`SELECT * FROM cards`)

        res.status(200).json({
            "message": "Address List",
            "data": savedCards
        })


    } catch (error) {
        console.log(error.message)
        return res.status(409).json({
            status: "failed",
            message: "doesn/t get"
        });
    }

}

//deleteCard
//implement soft delete
export const deleteCard = async (req, res) => {
    try {

        const deleteData = await qb.query(`DELETE FROM cards WHERE user_reference_id = '${req.body.user}'`)


        if (!deleteData) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while deleting the address"
            })
        }

        res.status(200).json({
            "message": "address deleted successfully",
            "data": deleteData
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




//updateCard
export const updateCard = async (req, res) => {
    try {

        const { card_number, cvv, card_type, valid_upto, person_name } = req.body;


        const updateAddressData = `UPDATE address SET card_number= '${card_number}', cvv='${cvv}', card_type='${card_type}', valid_upto='${valid_upto}}', person_name='${person_name}' WHERE user_reference_id = '${req.body.user}'`


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
                            message: 'Address Supdated successfully'
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