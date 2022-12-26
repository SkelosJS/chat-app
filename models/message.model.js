const mongoose = require('mongoose');

let messageSchema = new mongoose.Schema({
    user: { type: String, required: true },
    message: { type: String, required: true }
}, {
    timestamps: true
});

const MessageModel = mongoose.model('messages', messageSchema);

module.exports = MessageModel;