var express = require('express');
var router = express.Router();

/* GET view page. */
router.get('/courses/:id', async function (req, res, next) {
    res.render('course', {})
});

module.exports = router;
