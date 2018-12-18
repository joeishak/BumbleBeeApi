
/**Node Packages and Global Object - Declaration / Instantiation */
let express                    = require('express');
let router                     = express.Router();
let Reds =require('../models/Reds.js');
let Elephants =require('../models/Elephant.js');
let mySql                       = require('mySql');
let elephantData = require('../elephant');
let redData = require('../reds');

var config =
   {
     user: "node",
     password: "N0dem0nrule$",
     host: "localhost",
     port: "3306",
     database: 'egypt'
   }
const pool                     = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    if(err) console.log(err);
    else console.log('success');
})


// ETL From JSon to MYSql
exports.elephantData = (req,res,next)=>{
    elephantData.forEach((item) =>{
        let elephante = new Elephants(item);
        console.log(elephante);
        pool.query(elephante.insertIntoDatabase(true),(response, err, fields)=>{
            console.log(response)
        });
    });
res.send('hi from elephant');
};
// ETL From JSon to MYSql
exports.redData = (req,res,next)=>{
    console.log('I made it');
        redData.forEach((item) =>{
            let red = new Reds(item);
            console.log(red);
            pool.query(red.insertIntoDatabase(true),(response, err, fields)=>{
                console.log(response)
            });
        });
    res.send('hi from red');
};
exports.allElephant = (req,res,next)=>{
    pool.query('select * from egypt.elephant;',(err,response,fields)=>{
        res.send(response);
    });
};
exports.allRed = (req,res,next)=>{
    pool.query('select * from egypt.reds;',(err,response,fields)=>{
        res.send(response);
    });
};
// module.exports = router;
