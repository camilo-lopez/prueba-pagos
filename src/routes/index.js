const express = require ('express');
const router = express.Router();

router.get('/',(req, res)=>{
    res.send('Wena compare');
});

module.exports = router;