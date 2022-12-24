const publicRoot = process.cwd() + "/dist";

// Controllers
const messageController = require('../controllers/message.controller');

module.exports = (app) => {
    app.route('/api/v1/message/postMessage').post(messageController.postMessage);
    app.route('/api/v1/message/getAll').get(messageController.getAllMessages);
}