var mysql = require('mysql');

// ~ db connection stuff ...................................................... 
// NB: This assumes one backend connection at a time - no need for a pool
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
/* Some of these return promises so that we don't send undefined results to
the frontend */
module.exports = {
    getPosts() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM posts', (err, result) => {
                if (err) reject(err)
                else resolve(result);
            });
        });
    },
    getOnePost(postId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM posts WHERE id = ?', [postId],
                (err, result) => {
                    if (err) reject(err)
                    else resolve(result[0]);
                }
            );
        });

    },
    newPost(author, content) {
        connection.query(
            'INSERT INTO posts (author, content) VALUES (?, ?)', [author, content],
            (err, result) => {
                if (err) throw err;
                console.log(`Inserted ${result.affectedRows} rows.`);
            });
    },
    /**
     * Always terminate db connections before exit
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            connection.end(err => {
                if (err) reject(err)
                else resolve(1);
            });
        });
    }
};