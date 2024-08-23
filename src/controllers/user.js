import { qb } from "../../server.js"
import jwt from "jsonwebtoken"


export const check_phone_number = async (req, res) => {
    try {
        const { phone_number } = req.body

        //check if user already exists or not
        const existedUser = `SELECT id 
                             FROM users
                             WHERE phone_number = ${phone_number}`

        await qb.query(existedUser, async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {

                return res.status(409).json({
                    status: "failed",
                    message: "User already exists"
                });

            } else {
                return res.status(409).json({
                    status: "failed",
                    message: "User does not exists"
                });
            }
        })

    } catch (error) {
        console.log("check_phone_number", error)
    }
}


export const signup = async (req, res) => {
    try {
        const { phone_number, first_name, last_name, DOB, email, gender } = req.body

        //check if user already exists or not
        const existedUser = `SELECT id 
                             FROM users
                             WHERE phone_number = ${phone_number}`

        //extracting path
        const avatarPath = req.files.avatar[0].path

        await qb.query(existedUser, async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(409).json({
                    status: "failed",
                    message: "User already exists"
                });
            } else {
                //create new user
                const newUser = await qb.query(`INSERT INTO users 
                    (phone_number ,first_name,last_name , DOB,gender,email, avatar)
                    VALUES (
                    '${phone_number}',
                    '${first_name}',
                    '${last_name}',
                    '${DOB}', 
                    '${gender}', 
                    '${email}', 
                    '${avatarPath}')`)


                if (!newUser) {
                    return res.status(500).json({
                        status: 'error',
                        message: "something went wrong while registering the user"
                    })
                } else {
                    res.status(200).json({
                        "message": "signup successful",
                        "data": newUser
                    })
                }

            }
        })


    } catch (error) {
        console.log("signup", error)

    }
}


export const login = async (req, res) => {
    try {
        const { phone_number } = req.body

        //check existed user
        const existedUser = `SELECT id 
                             FROM users
                             WHERE
                             phone_number = '${phone_number}'`



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

                    return res.status(401).json({
                        "message": 'Authentication failed'
                    });

                } else {
                    return res
                        .status(200)
                        .json({
                            status: 'success',
                            data: token,
                            message: "User Successfully"
                        })
                }
            } else {
                console.log('User does not exist');

                return res.status(409).json({
                    status: "failed",
                    message: "User does not exists, please signup first"
                });

            }
        })


    } catch (error) {
        console.log("login ", error)
    }
}

export const updateUserProfile = async (req, res) => {
    try {
        const { phone_number, first_name, last_name, DOB, email, gender } = req.body;


        const updateData = `UPDATE users 
                            SET
                            phone_number = '${phone_number}', 
                            first_name='${first_name}', 
                            last_name='${last_name}', 
                            DOB='${DOB}', 
                            email='${email}', 
                            gender='${gender}', 
                            avatar='${req.files.avatar[0].path}'  
                            WHERE id ='${req.query.user}'`

        console.log(updateData, "ghj")


        await qb.query(updateData, async (err, results) => {

            if (err) {
                return err;
            } else {
                if (results.affectedRows == 0) {
                    res.status(500).json({
                        "message": 'User not found or no changes made'
                    });
                } else {
                    res.status(200)
                        .json({
                            message: 'User Data updated successfully',
                            data: results
                        });
                }
            }

        })

    } catch (error) {
        console.log("updateUserProfile", error)
    }
}






