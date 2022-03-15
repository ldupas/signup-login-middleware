const connection = require('../db-config');

const findAll = async () => {
    return connection.promise().query('SELECT * FROM posts');
}

const insertPost = async ({title, content}, picture) => {
        return connection.promise().query('INSERT INTO posts (`title`, `content`, `picture`) VALUES (?, ?, ?)', [title, content, picture])
};

module.exports = {
    findAll,
    insertPost,
};