import dotenv from 'dotenv'
dotenv.config({
    path: "./.env"
});


const settings = {
    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_USER,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DBNAME,
    "charset": 'utf8mb4',
    "dbcollat": 'utf8mb4_unicode_ci'
};

export default settings


