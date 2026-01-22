const admin = require("../config/firebase");

exports.sendTopicNotification = async (title, body, data = {}) => {
    if (!tokens.length) return;

    const message = {
        topic: 'categories',
        notification: { title, body },
        data,
    };

    await admin.messaging().send(message);
};


exports.sendMany = async (tokens, title, body, data = {}) => {
    if (!tokens.length) return;

    const message = {
        tokens,
        notification: { title, body },
        data,
    };

    await admin.messaging().sendEachForMulticast(message);
};
