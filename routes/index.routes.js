const express = require('express');
const router = express.Router();


const isLoggedIn = () => {
    return (req, res, next) => {
        if(req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }
}

/* GET home page */
router.get('/', (req, res, next) => res.render('index'));

router.get('/main', isLoggedIn(), (req, res, next) => {
    res.render('main');
});

router.get('/private', isLoggedIn(), (req, res, next) => {
    res.render('private');
})

module.exports = router;
