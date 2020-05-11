const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require ('../lib/auth')
const { isNotLoggedIn } = require ('../lib/auth')
router.get('/signup',isNotLoggedIn,(req, res)=>{
    res.render('autenticacion/register');
});


router.post('/signup',isNotLoggedIn, passport.authenticate('local.signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}))

router.get('/login',isNotLoggedIn,(req, res)=>{
    res.render('autenticacion/login')
})
router.post('/login',isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local.signin', {
        successRedirect: '/pagos',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/profile', isLoggedIn, (req, res)=> {
    res.send('Es tu perfil')
});

router.get('/logout',isLoggedIn, (req, res)=> {
   req.logOut();
   res.redirect('/login')
});
module.exports = router;