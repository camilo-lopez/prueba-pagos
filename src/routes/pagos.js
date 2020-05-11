const express = require('express');
const router = express.Router();
const { isLoggedIn } = require ('../lib/auth')

const db = require('../database');

router.get('/add', isLoggedIn, async (req, res)=>{
const proyecto = await db.query('SELECT * FROM proyecto')
    
    res.render('pagos/add', {proyecto})
})

router.post('/add',isLoggedIn, async (req,res)=>{
    const { region, item, valorencuesta,numeroencuesta, total,bruto, impuesto, neto } = req.body;
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

module.exports = router;