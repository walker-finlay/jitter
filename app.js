/**
 * app.js - jitter backend entry point for LForm
 * author: walker-finlay
 */
const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');

// Serve static home page
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

// Listen for requests
var port = process.env.PORT | 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// console.log(db.getPosts());
db.getOnePost(1).then(res => console.log(res));

/**
 * Graceful shutdown on SIGINT
 */
process.on('SIGINT', () => {
    console.log('Received SIGINT');
    db.disconnect()
        .then(status => {
            console.log(`Connection closed: ${status}`);
            process.exit();
        })
        .catch(err => {
            console.error(err);
            process.exit();
        });
});