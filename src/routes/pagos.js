const express = require('express');
const router = express.Router();
const fs = require("fs");
const helpers = require('../lib/helpers');
const LocalStrategy = require('passport-local').Strategy;
const { isLoggedIn } = require ('../lib/auth');
const db = require('../database');

router.get('/show/:id', async (req,res) => {
    const {id} = req.params
    const pago = await db.query('SELECT * FROM pago WHERE id = ?',[id])
    const proyecto = await db.query('SELECT * FROM proyecto WHERE id = ?',[pago[0].idproyecto]) 
    res.render('pagos/show', {pago:pago[0], proyecto})
})

router.get('/allpagos', async (req,res) => {
    const allpagos = await db.query('select pago.id AS pagoid, region, idproyecto, valorencuesta, numeroencuesta, total, neto, totalpagar, pago.rut, nombre, apellidop,apellidom, usuarios.id FROM pago INNER JOIN usuarios on pago.rut = usuarios.rut')  
    res.render('pagos/todos', {allpagos})
    
})
router.get('/add/:id', isLoggedIn, async (req, res)=>{
    const {id} = req.params
    const proyecto = await db.query('SELECT * FROM proyecto')
    const usuario = await db.query('SELECT * FROM usuarios WHERE id = ?',[id])
   
res.render('pagos/add', {proyecto , usuario:usuario[0]})
})
router.post('/add/:id',isLoggedIn, async (req,res)=>{
    const {id} = req.params
    const rutt = await db.query('SELECT rut FROM usuarios WHERE id = ?',[id])  
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
    rut: rutt[0].rut
    };
    await db.query ('INSERT INTO pago SET ?', [newPago]);
    req.flash('success','Pago agregado correctamente')
    res.redirect("/pagos");
});
router.get('/', isLoggedIn ,async (req, res) => {
    const pagos = await db.query('SELECT * FROM pago WHERE rut = ?',[req.user.rut])
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


module.exports = router;