/**
 * app.js - jitter backend entry point for LForm
 * author: walker-finlay
 */
const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');


// Middleware .................................................................
// Serve static home page
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ~ Routes ...................................................................
app.get('/posts', (req, res) => {
    console.log(`GET /posts`);
    db.getPosts()
        .then(posts => {
            res.send(posts);
        })
        .catch(err => {
            console.error(err);
        });
});

app.post('/posts', (req, res) => {
    // console.log(`POST /posts`);
    console.log(req.body);
    db.newPost(req.body.username, req.body.content)
        .then(newID => {
            res.send(String(newID));
        })
        .catch(err => {
            console.error(err);
            res.status(403).send(err);
        });
});

app.put('/posts', (req, res) => {
    console.log(`PUT /post`);
    console.log(req.body);
    db.updatePost(req.body.postID, req.body.content);
    res.end(0);
});

// Listen for requests
var port = process.env.PORT | 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

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