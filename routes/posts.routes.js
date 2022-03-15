const router = require('express').Router();
const multer = require('multer');
const { findAll, insertPost } = require('../models/posts');

const upload = multer({ dest: 'uploads/posts/'});

router.get('/', async (req, res) => {
    const [posts] = await findAll();
    res.json(posts);
});

router.post('/', upload.single('picture'), async (req, res) => {
    const [{ insertId: id}] = await insertPost(req.body, req.file.path);

    return res.json({
        ...req.body,
        id,
        picture: req.file.filename
    });
});

module.exports = router;