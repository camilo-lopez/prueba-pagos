const express = require('express');
const router = express.Router();
const { isLoggedIn } = require ('../lib/auth')

const db = require('../database');

router.get('/proyecto', async (req, res) => {
    const proyectos = await db.query ('SELECT * FROM proyecto');
    res.render('proyectos/list', {proyectos})
});

router.get('/proyecto/add', async (req, res) => {
    res.render('proyectos/add')
});
router.post('/proyecto/add', async (req, res) => {
    const {nombre, codigo} = req.body;
    const newProycto = {
        nombre, 
        codigo
    };
    await db.query ('INSERT INTO proyecto SET ?', [newProycto]);
    req.flash('success','Proyecto agregado correctamente')
    res.redirect('/proyecto')
});

router.get('/proyecto/edit/:id', async (req,res) => {
    const { id } = req.params;
    const proyecto = await db.query('SELECT * FROM proyecto WHERE id = ?',[id])
    res.render('proyectos/edit', {proyecto:proyecto[0]})
})

router.post('/proyecto/edit/:id', async (req,res)=>{
    const { nombre, codigo } = req.body;
    const {id} = req.params;
    const editProyecto = {
        nombre,
        codigo
    };
    await db.query ('UPDATE proyecto SET ? WHERE id = ?', [editProyecto, id]);
    req.flash('success','Editado correctamente')
    res.redirect("/proyecto");
});

router.get('/proyecto/delete/:id', async (req,res) => {
    const{id} = req.params
    db.query ('DELETE FROM proyecto WHERE ID = ?',[id])
    req.flash('success','Eliminado correctamente')
    res.redirect('/proyecto')
})



module.exports = router;