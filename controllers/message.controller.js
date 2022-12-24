const MessageModel = require('../models/message.model');

module.exports.postMessage = (req, res) => {
    const message = new MessageModel({
        user: req.body.user,
        message: req.body.message,
        user_ip: req.body.user_ip
    });

    message.save()
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(400).json(err))
}

module.exports.getAllMessages = (req, res) => {
    MessageModel.find().select('-user_ip').exec((err, data) => {
        if(err) return res.status(400).json({ err });
        else return res.status(200).json(data);
    });
}