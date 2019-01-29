
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let mySql = require('mysql');
let elephantData = require('../data/elephant');
let redData = require('../data/reds');
let _ = require('lodash');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
let config = require('../joeconfig');


const pool = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    if (err) console.log(err);
    else console.log('success');
})


exports.allRed = (req, res, next) => {
    pool.query('select * from egypt.reds;', (err, response, fields) => {
        res.send(response);
    });
};
