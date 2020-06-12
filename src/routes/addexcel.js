const path = require('path');
var csvParser = require('csv-parse');
const db = require('../database');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const fs = require("fs");

router.get('/addexcel', async (req,res) => {
    res.render('excel/addexcel')
})

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename:  (req, file, cb) => {
        cb(null, Date.now()+'-' +file.originalname);
    }
})
const uploadImage = multer({
    storage,
    limits: {fileSize: 10000000}
}).single('excel');

router.post('/addexcel',uploadImage,async (req, res) => {
    const { excel } = req.body
    const nombre = req.file.filename
   const url =  path.join(__dirname, '../public/uploads/'+nombre)
    fs.readFile(url, {
        encoding: 'utf-8'
   }, function(err, csvData) {
        if (err) {
          console.log(err);
        }
   
        csvParser(csvData, {
          delimiter: ';'
        }, async function(err, data) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            const resultado = await db.query('INSERT INTO pago (region, idproyecto, item, valorencuesta, numeroencuesta, total, bruto, impuesto, neto, totalpagar, rut)VALUES ?', [data])
            req.flash('success','Pago agregado correctamente!')
            res.redirect("/pagos");
          }

        });

   });
});
   module.exports = router;
