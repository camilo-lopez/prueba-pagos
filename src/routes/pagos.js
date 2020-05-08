const express = require('express');
const router = express.Router();

const db = require('../database');

router.get('/add',(req, res)=>{
res.render('pagos/add')
})

router.post('/add',(req,res)=>{
    res.send('recibido camarada')
})

module.exports = router;