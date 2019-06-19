const express = require('express');
const router = express.Router();

//@router GET api/posts/tests
//@desc test Posts route
//@access PUBLIC


router.get('/tests', (req, res) => res.json({msg: 'posts Works'}));

module.exports = router;