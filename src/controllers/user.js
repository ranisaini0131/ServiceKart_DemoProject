import { qb } from "../../server.js"
import jwt from "jsonwebtoken"


//page 4
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

//page 7

export const signup = async (req, res) => {
    try {
        //get user details from frontend
        const { phone_number, first_name, last_name, DOB, email, gender } = req.body

        //validation
        if (!(phone_number || first_name || last_name || DOB || gender || email)) {
            return res.status(400).json({
                status: "failed",
                message: "Please provide all fields",
            })
        }


        //check if user already exists or not

        const existedUser = `SELECT id FROM users WHERE phone_number = ${phone_number}`

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
                console.log('User does not exist');

                //create new user
                const newUser = await qb.query(`INSERT INTO users (phone_number ,first_name,last_name , DOB,gender,email, avatar) VALUES ('${phone_number}','${first_name}','${last_name}','${DOB}', '${gender}', '${email}', '${avatarPath}')`)

                console.log(newUser, "dd")

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


//page 14
export const updateUserProfile = async (req, res) => {
    try {

        const { phone_number, first_name, last_name, DOB, email, gender } = req.body;


        const updateData = `UPDATE users SET phone_number = '${phone_number}', first_name='${first_name}', last_name='${last_name}', DOB='${DOB}', email='${email}', gender='${gender}', avatar='${req.files.avatar[0].path}'  WHERE id = '${req.query.user}'`


        await qb.query(updateData, async (err, results) => {

            if (err) {
                return err;
            } else {
                if (results.affectedRows <= 0) {
                    res.status(500).json({
                        "message": 'User not found or no changes made'
                    });
                } else {
                    res.status(200)
                        .json({
                            message: 'User Data updated successfully'
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



//store Details page 22


//cancel order page 25


//order page page 27


//store details page 37

//order details page 38




// static async updateField(id, key, value) {
//     const connection = await pool.getConnection();
//     try {
//         if (key === 'status' && value === '2') {
//             // Implement soft delete
//             await connection.query('UPDATE blogs SET status = ?, deleted_at = NOW() WHERE id = ?', [value, id]);
//         } else {
//             await connection.query(UPDATE blogs SET ${ key } = ? WHERE id = ?, [value, id]);
//         }
//         const [updatedRows] = await connection.query('SELECT * FROM blogs WHERE id = ?', [id]);
//         return updatedRows[0];
//     } finally {
//         connection.release();
//     }
// }
// }


