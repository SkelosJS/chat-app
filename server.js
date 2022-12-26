const express = require('express');
const serverless = require('serverless-http');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ['https://skelos-chatapp.netlify.app'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});
const cors = require('cors');
const mongoose = require('mongoose');

// publicRoot
const publicRoot = process.cwd() + "/public";
require('dotenv').config();

const router = express.Router();
app.use('/.netlify/functions/server', router);

app.use(express.static(publicRoot));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({ origin: ['https://skelos-chatapp.netlify.app'], credentials: true }));


// Routers
const messageRouter = require('./routes/message.route');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected !');
    
    // Routers
    messageRouter(app);
    
    io.on('connection', (socket) => {
        console.log("A user has connected");
        
        // quand un utilisateur émet un socket de type "message"
        socket.on('chat message', (data) => {
            io.emit('chat message', data);
        });
        
        socket.on('disconnect', () => {
            console.log("A user has disconnected");
        })
    });
});


http.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});

module.exports.handler = serverless(app);