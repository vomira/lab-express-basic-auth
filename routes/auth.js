const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt')

router.get('/signup', (req, res, next) => {
    res.render('signup');
})

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;
    if(password.length < 8) {
        res.render('signup', {
            message: 'Your password must be at least 8 characters long!'
        });
        return;
    }
    if(username === '') {
        res.render('signup', {
            message: 'Your username is empty!'
        });
        return;
    }
    User.findOne({username: username})
    .then(found => {
        if(found !== null) {
            res.render('signup', {
                message: 'This username is already taken!'
            })
        } else {
            const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(password, salt);
            User.create({
                username: username,
                password: hash
            })
            .then(user => {
                res.redirect('/login');
                })
            .catch(err => next(err));
            }
        }
    );
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username: username})
    .then(found => {
        if(found === null) {
            res.render('login', { message: 'Invalid Credentials'});
            return;
        }
        if(bcrypt.compareSync(password, found.password)) {
            req.session.user = found;
            res.render('dashboard', {
                user: found
            })
        } else {
            res.render('login', { message: 'Invalid Credentials' });
            return;
        }
})
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(error => {
      if(error) {
        next(error);
      } else {
        res.redirect('/');
      }
    })
  })

module.exports = router;