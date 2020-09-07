import mysql from 'mysql';

export default mysql.createConnection({
    host: "localhost:3306",
    user: "root",
    password: "",
    database: "access-document"
});