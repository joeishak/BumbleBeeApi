
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let KhppDiagnostics = require('../models/KhppDiagnostics.js');
let mySql = require('mysql');
let elephantData = require('../data/elephant');
let redData = require('../data/reds');
let khppBody = require('../data/khppbodysherd.js');
let khppDiagnostics = require('../data/khppdiagnostics.js');
let _ = require('lodash');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
let config = require('../jrconfig');

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
        // console.log(elephante);
        pool.query(elephante.insertIntoDatabase(true), (response, err, fields) => {
            if (err) {
                console.log(response);
            }
        });

    });
    res.send('Records have been inserted');

};

exports.redData = (req, res, next) => {
    console.log('I made it');
    redData.forEach((item) => {
        let red = new Reds(item);
        console.log(red);
        pool.query(red.insertIntoDatabase(true), (response, err, fields) => {
            if (err) console.log(err);
        });
    });
    res.send('hi from red');
};
//End ETL


exports.khppBodySherds = (req, res, next) => {
    // console.log('I made it');
    khppBody.forEach((item) => {
        let red = new Reds(item);
        console.log(red);
        pool.query(red.insertIntoDatabase(true), (response, err, fields) => {
            if (err) console.log(err);
        });
    });
    res.send('hi from red');
};

exports.khppDiagnostics = (req, res, next) => {
    // console.log('I made it');
    khppDiagnostics.forEach((item) => {
        let khpp = new KhppDiagnostics(item);
        console.log(khpp);
        pool.query(khpp.insertIntoDatabase(true), (response, err, fields) => {
            if (err) console.log(err);

            console.log(response);
        });
    });
    res.send('hi from khpp');
};
//End ETL
