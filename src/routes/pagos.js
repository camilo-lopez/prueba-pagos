const express = require('express');
const router = express.Router();
const fs = require("fs");
const fastcsv = require("fast-csv");
const helpers = require('../lib/helpers');
const LocalStrategy = require('passport-local').Strategy;
const { isLoggedIn } = require ('../lib/auth');
const nodemailer = require ('nodemailer');




const db = require('../database');

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
    const url = `http://localhost:4000/pagos/forgot_p4ssw0rd/new/${user[0].id}`
    if (user.length > 0){
        contentHTML = `
            <h1>Hola! ${user[0].nombre}, solicitaste un cambio de contraseña</h1><br>
            <h3>Ingresa al siguiente link para cambiar tu contraseña: ${url}</h3>
        `; 
        const transporter = nodemailer.createTransport({
            host: 'mail.datavoz.cl',
            port: '50001',
            secure: false,
            auth:{
                user: 'pruebac@datavoz.cl',
                pass: 'pXq?D4{ZoU~d'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
       const info = await transporter.sendMail({
            from: "'Admin Datavoz' <pruebac@datavoz.cl>",
            to: correo,
            subject: 'Cambiar contraseña',
            html: contentHTML
        });
        console.log("mensaje enviado", info.messageId)
        req.flash('success',`Se envió un correo a ${correo} con los pasos para cambiar la contraseña.`)
        res.redirect('/pagos/send-email')

    }else{
        req.flash('message',`El correo ${correo} no existe, verifica que este correcto.`)
        res.redirect('/pagos/send-email')
    }
    
})



router.get('/addexcel', async (req,res) => {
  
    res.render('pagos/addexcel')
})

router.post('/addexcel',async (req, res) => {
    

})


router.get('/add', isLoggedIn, async (req, res)=>{
const proyecto = await db.query('SELECT * FROM proyecto')
    
    res.render('pagos/add', {proyecto})
})

router.post('/add',isLoggedIn, async (req,res)=>{
    const { region, item, valorencuesta, numeroencuesta, total, bruto, impuesto, neto } = req.body;
    const totalpagar = req.body.totalPagar;
    const idproyecto = req.body.proyecto;
    const newPago = {
    region, 
    idproyecto, 
    item, 
    valorencuesta, 
    numeroencuesta,
    total,
    bruto, 
    impuesto, 
    neto, 
    totalpagar,
    idusuario:req.user.id
    };
    await db.query ('INSERT INTO pago SET ?', [newPago]);
    req.flash('success','Pago agregado correctamente')
    res.redirect("/pagos");
});

router.get('/', isLoggedIn ,async (req, res) => {
    const pagos = await db.query('SELECT * FROM pago WHERE idusuario = ?',[req.user.id])
   
    res.render('pagos/list', {pagos})
})

router.get('/delete/:id',isLoggedIn, async (req,res) => {
    const{id} = req.params
    db.query ('DELETE FROM pago WHERE ID = ?',[id])
    req.flash('success','Eliminado correctamente')
    res.redirect('/pagos')
})
router.get('/edit/:id',isLoggedIn, async (req,res) => {
    const { id } = req.params;
    const proyecto = await db.query ('SELECT * FROM proyecto')
    const pago = await db.query('SELECT * FROM pago WHERE id = ?',[id])
    res.render('pagos/edit', {pago:pago[0], proyecto})
})



router.post('/edit/:id',isLoggedIn, async (req,res)=>{
    const { region, item, valorencuesta,numeroencuesta, total,bruto, impuesto, neto } = req.body;
    const totalpagar = req.body.totalPagar;
    const idproyecto = req.body.proyecto;
    const {id} = req.params;
    const newPago = {
    region, 
    idproyecto, 
    item, 
    valorencuesta, 
    numeroencuesta,
    total,
    bruto, 
    impuesto, 
    neto, 
    totalpagar
    };
    await db.query ('UPDATE pago SET ? WHERE id = ?', [newPago, id]);
    req.flash('success','Editado correctamente')
    res.redirect("/pagos");
});

/* router.get('/proyecto/add', async (req, res) => {
    res.render('proyectos/add')
});

router.post('/proyecto/add', async (req, res) => {

  console.log(req.body)
    //await db.query ('INSERT INTO pago SET ?', [newPago]);
    //req.flash('success','Pago agregado correctamente')
    res.send("Llegó");
}); */

module.exports = router;