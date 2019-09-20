
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let mySql = require('mysql');
let _ = require('lodash');


//Data  + Configs
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let elephantData = require('../elephant');
let redData = require('../reds');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
let config = require('../db.config');


const pool = new mySql.createConnection(config.joe)
// Check for Errors
pool.connect(err => {
    if (err) console.log(err);
    else console.log('success');
})

exports.postRequestTest = (req,res,next) =>{
    // console.log('Request', req.body);
    res.send({message: 'successfull', request: req.body})
}

exports.heartbeat = (req,res,next) => {
    res.send({message: 'connected'});
}




