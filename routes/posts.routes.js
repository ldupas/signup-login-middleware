const connection = require("../db-config");
const router = require("express").Router();

router.get('/', (req, res) => {
    connection.query('SELECT * FROM posts', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving posts from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
    const postId = req.params.id;
    connection.query(
        'SELECT * FROM posts WHERE id = ?',
        [postId],
        (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving post from database');
        } else {
            if (results.length) res.json(results[0]);
            else res.status(404).send('Post not found');
        }
        }
    );
});

module.exports = router;

