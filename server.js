import express from "express"
import mysql from "mysql"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import queryBuilder from "node-querybuilder"
import settings from "./src/database/db.js"


const app = express()
const port = 9000;
app.use(bodyParser.json())
dotenv.config({
    path: "./.env"
})



//database connection

const connection = mysql.createConnection(settings);
connection.connect((err) => {
    if (err) throw err;
    console.log('Database is connected successfully!');
});

export const qb = new queryBuilder(settings, 'mysql', 'single');


//import api
import userRoute from "./src/routes/userRoute.js"
import addressRoute from "./src/routes/addressRoutes.js"
import cardRoute from "./src/routes/cardsRoutes.js"
import productRoute from "./src/routes/productRoute.js"



app.use("/user", userRoute)
app.use("/address", addressRoute)
app.use("/card", cardRoute)
app.use("/products", productRoute)









app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`)
})