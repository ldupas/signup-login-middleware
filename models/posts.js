const connection = require('../db-config');

const findAll = async () => {
    return connection.promise()
    .query('SELECT * FROM posts');
}

const insertPost = ({
    title, 
    content, 
    user_id}, 
    picture) => {
        connection
        .promise()
        .query('INSERT INTO posts (`title`, `content`, `user_id`, `picture`) VALUES (?, ?, ?, ?)',
        [
            title,
            content,
            user_id,
            picture,
        ])
};

module.exports = {
    findAll,
    insertPost
};