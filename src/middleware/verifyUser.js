import jwt from "jsonwebtoken"
import { qb } from "../../server.js"

export const verifyJWT = async (req, res, next) => {
    try {

        const token = req.header
            ("Authorization")?.replace("Bearer ", "")


        if (!token) {
            res.status(402).json({
                status: "failed",
                message: "Unauthorized request"
            })
        }

        //verify Token
        const decodedToken = jwt.verify(token, process.env.SECREAT_KEY)

        const user = `SELECT id FROM users WHERE id = ${decodedToken.id}`

        await qb.query(user, async (err, results) => {
            if (err) throw err;

            else if (!results) {

                res.status(404).json({
                    status: "failed",
                    message: "Invalid Access Token"
                })
            } else {
                req.body.user = results[0].id //
                req.query.user = results[0].id //form-data 

                next()

            }


        })


    } catch (error) {
        res.status(401).json({
            status: "failed",
            error: error?.message,
            message: "Invalid Access Tokening",
        })
    }
}