var mysql = require('mysql');

// ~ db connection stuff ...................................................... 
// NB: This assumes one (or a few) connection(s) at a time - no need for a pool
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: process.env.PASS,
    database: 'jitter',
});

connection.connect(err => {
    if (err) {
        console.error(`error connecting: ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
});

// ~ Methods for backend ...................................................... 
module.exports = {
    async cleanExit() {
        await connection.end(err => {
            console.error(`Error closing mysql connection: ${err.stack}`);
            process.exit();
        });
        console.log('Connection closed.');
        process.exit();
    }
};