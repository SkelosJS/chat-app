const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const cors = require('cors');

// publicRoot
const publicRoot = process.cwd() + "/public";
require('dotenv').config();

app.use(express.static(publicRoot));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));



io.on('connection', (socket) => {
    console.log("A user has connected");
});

http.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});