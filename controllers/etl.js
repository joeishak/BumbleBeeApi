
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let mySql = require('mysql');
let elephantData = require('../elephant');
let redData = require('../reds');
let _ = require('lodash');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
let config = require('../joeconfig');

const pool = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    if (err) console.log(err);
    else console.log('success');
})


// ETL From JSon to MYSql
exports.elephantData = (req, res, next) => {
    elephantData.forEach((item) => {
        let elephante = new UnCleansedElephants(item);
        console.log(elephante);
        pool.query(elephante.insertIntoDatabase(true), (response, err, fields) => {
            console.log(response)
        });
    });
    res.send('hi from elephant');
};

exports.redData = (req, res, next) => {
    console.log('I made it');
    redData.forEach((item) => {
        let red = new Reds(item);
        console.log(red);
        pool.query(red.insertIntoDatabase(true), (response, err, fields) => {
            console.log(response)
        });
    });
    res.send('hi from red');
};
//End ETL