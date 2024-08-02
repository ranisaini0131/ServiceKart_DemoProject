import { qb } from "../../server.js"
import jwt from "jsonwebtoken"

export const check_phone_number = async (req, res) => {
    try {
        //get user details from frontend
        const { phone_number } = req.body

        //validation
        if (!phone_number) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }


        //check if user already exists or not

        const existedUser = `SELECT id FROM users WHERE phone_number = ${phone_number}`

        await qb.query(existedUser, async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(409).json({
                    status: "failed",
                    message: "User already exists"
                });
            } else {
                console.log('User does not exist');
                return res.status(409).json({
                    status: "failed",
                    message: "User does not exists"
                });
            }
        })

    } catch (error) {
        console.log("error:", error)
    }
}


export const signup = async (req, res) => {
    try {
        //get user details from frontend
        const { phone_number, first_name, last_name, DOB, email, gender } = req.body

        //validation
        if (!(first_name || last_name || DOB || gender || email)) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }


        //check if user already exists or not

        const existedUser = `SELECT id FROM users WHERE phone_number = ${phone_number}`

        await qb.query(existedUser, async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(409).json({
                    status: "failed",
                    message: "User already exists"
                });
            } else {
                console.log('User does not exist');

                //create new user
                const newUser = await qb.query(`INSERT INTO users (phone_number ,first_name,last_name , DOB,gender,email) VALUES ('${phone_number}','${first_name}','${last_name}','${DOB}', '${gender}', '${email}')`)

                if (!newUser) {
                    return res.status(500).json({
                        status: 'error',
                        message: "something went wrong while registering the user"
                    })
                }

                res.status(200).json({
                    "message": "signup successful",
                    "data": newUser
                })

            }
        })


    } catch (error) {
        console.log("error:", error)

    }
}


export const login = async (req, res) => {
    try {
        const { phone_number } = req.body

        //check fields
        if (!phone_number) {
            return res.status(422).json({
                status: "fail",
                message: "Please provide required field"
            })
        }

        //check existed user
        const existedUser = `SELECT id FROM users WHERE phone_number = ${phone_number}`



        await qb.query(existedUser, async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {

                //generate token
                const token = jwt.sign(
                    {
                        id: results[0].id,
                    },
                    process.env.SECREAT_KEY,
                    {
                        expiresIn: process.env.TOKEN_EXPIRY
                    }
                )

                if (!token) {
                    return res.status(401).json({ message: 'Authentication failed' });
                }

                //return response 
                return res
                    .status(200)
                    .json({
                        status: 'success',
                        data: token,
                        message: "User Successfully"
                    })
            } else {
                console.log('User does not exist');

                return res.status(409).json({
                    status: "failed",
                    message: "User does not exists, please signup first"
                });

            }
        })


    } catch (error) {
        console.log("Error: ", error.message)
    }
}



// //generate token
// const token = jwt.sign(
//     {
//         id: results[0].id
//     },
//     process.env.SECREAT_KEY,
//     {
//         expiresIn: process.env.TOKEN_EXPIRY
//     }
// )

// if (!token) {
//     return res.status(401).json({ message: 'Authentication failed' });
// }
