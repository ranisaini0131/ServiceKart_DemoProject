import { qb } from "../../server.js"

//page 17
//how to take card details 
export const addCards = async (req, res) => {
    try {

        const { card_number, cvv, card_type, valid_upto, person_name, user_reference_id } = req.body
        console.log(req.body)

        //insert data
        const addCards = await qb.query(`INSERT INTO card (card_number,cvv, card_type, valid_upto, person_name, user_reference_id) VALUES ('${card_number}','${cvv}','${card_type}','${valid_upto}', '${person_name}','${user_reference_id}')`)


        if (!addCards) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while adding the cards"
            })
        }

        res.status(200).json({
            "message": "card added successfully",
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

        const savedCards = await qb.query(`SELECT card_number, cvv, card_type, valid_upto, person_name FROM card`)

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


        const updateCardData = `UPDATE card SET card_number= '${card_number}', cvv='${cvv}', card_type='${card_type}', valid_upto='${valid_upto}}', person_name='${person_name}' WHERE user_reference_id = '${req.body.user}'`

        console.log(updateCardData)

        if (!updateCardData) {
            return res.status(500).json({
                status: 'error',
                message: "something went wrong while updating the card details"
            })
        }

        res.status(200).json({
            "message": "card details updated successfully",
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