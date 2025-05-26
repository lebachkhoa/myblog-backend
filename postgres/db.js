const {Pool} = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    max:10,                     // toi da 10 ket noi cung luc                     
    idleTimeoutMillis: 30000    // dong ket noi neu khong dung sau 30s
});

pool.on("connect", () => {
    console.log("PosgreSQL pool connected");
});

pool.on("error", (err)=>{
    console.log(err.message);
});

module.exports = pool;

