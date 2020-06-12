const express = require('express');
const router = express.Router();
const db = require('../database');
const passport = require('passport');
const { isLoggedIn } = require ('../lib/auth')
const { isNotLoggedIn } = require ('../lib/auth')
const nodemailer = require ('nodemailer');
const helpers = require('../lib/helpers');
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

router.get('/forgot_p4ssw0rd/new/:id',(req,res) => {
    res.render('autenticacion/newpass')
})
router.post('/forgot_p4ssw0rd/new/:id',async(req,res) => {
    const newContrasena = req.body.contrasena
    const id = req.params.id
    contrasena = await helpers.encriptar(newContrasena)
    await db.query ('UPDATE usuarios SET contrasena = ? WHERE id = ?', [contrasena, id]);
    req.flash('success',`La contraseña se actualizó correctamente`)
    res.redirect('/login')
})
router.get('/send-email',(req,res) => {
    res.render('autenticacion/forgot')
})
router.post('/send-email',async (req,res) => {
    const { correo } = req.body
    const user = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo])
    if (user.length > 0){
        const url = `http://localhost:4000/forgot_p4ssw0rd/new/${user[0].id}` //Agregar URL correspondiente cuando pase a produccion 
        contentHTML = `
            <h1>Hola! ${user[0].nombre}, solicitaste un cambio de contraseña</h1><br>
            <h3>Ingresa al siguiente link para cambiar tu contraseña: ${url}</h3>
        `; 
        const transporter = nodemailer.createTransport({
            host: 'host',
            port: 'port',
            secure: false,
            auth:{
                user: 'user',
                pass: 'pass'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
       const info = await transporter.sendMail({
            from: "'Admin Datavoz' <correo>",
            to: correo,
            subject: 'Cambiar contraseña',
            html: contentHTML
        });
        console.log("mensaje enviado", info.messageId)
        req.flash('success',`Se envió un correo a ${correo} con los pasos para cambiar la contraseña.`)
        res.redirect('/send-email')

    }else{
        req.flash('message',`El correo ${correo} no existe, verifica que esté correcto.`)
        res.redirect('/send-email')
    }
    
})


router.get('/profile', isLoggedIn, (req, res)=> {
    res.redirect('/pagos')
});

router.get('/logout',isLoggedIn, (req, res)=> {
   req.logOut();
   res.redirect('/login')
});
module.exports = router;