import { qb } from "../../server.js"


export const addCards = async (req, res) => {
    try {

        const { card_number, cvv, card_type, valid_upto, person_name } = req.body


        const addCards = `INSERT INTO card 
                                        (card_number,cvv, card_type, valid_upto, person_name, user_reference_id)
                                        VALUES (
                                        '${card_number}',
                                        '${cvv}',
                                        '${card_type}',
                                        '${valid_upto}', 
                                        '${person_name}',
                                        '${req.body.user}')`


        await qb.query(addCards, (err, results) => {
            if (err) throw err;

            else if (results.length == 0) {
                return res.status(500).json({
                    status: 'error',
                    message: "something went wrong while adding the cards"
                })
            } else {
                res.status(200).json({
                    "message": "card added successfully",
                    "data": results
                })
            }
        })


    } catch (error) {
        console.log("addCards", error)
    }


}


export const savedCardsList = async (req, res) => {

    try {

        const savedCards = `SELECT 
                                           card.id,card_number, cvv, card_type, valid_upto, person_name
                                           FROM card
                                           WHERE status='1' AND user_reference_id='${req.body.user}'`


        await qb.query(savedCards, (err, results) => {
            if (err) throw err;

            else if (results.length == 0) {
                res.status(500).json({
                    "message": "No Address List Found"
                })
            } else {
                res.status(200).json({
                    "message": "Address List",
                    "data": results
                })
            }
        })


    } catch (error) {
        console.log("savedCardList", error)
    }

}

export const updateCard = async (req, res) => {
    try {

        const { card_number, cvv, card_type, valid_upto, person_name } = req.body;


        const updateCardData = await qb.query(`UPDATE card 
                                SET 
                                card_number= '${card_number}', 
                                cvv='${cvv}', 
                                card_type='${card_type}', 
                                valid_upto='${valid_upto}', 
                                person_name='${person_name}' 
                                WHERE user_reference_id = '${req.body.user}'`)


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


export const updateCardStatus = async (req, res) => {
    try {

        const { status, cardId } = req.body


        await qb.query(`UPDATE card 
                        SET status = '${status}'
                        WHERE id = '${cardId}' AND 
                        user_reference_id = '${req.body.user}'`)

        let message;

        switch (status) {
            case '1':
                message = 'Card is active';
                break;
            case '0':
                message = 'Card is inactive';
                break;
            default:
                message = 'Card is deleted';
                break;
        }

        res.status(400).json({ message });

    } catch (error) {
        console.log("updateStatus", error)
    }
}