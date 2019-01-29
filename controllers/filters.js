
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let mySql = require('mysql');
let _ = require('lodash');
let config = require('../joeconfig.js');

let categorized, grouped, accumulated = [];
const pool = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    if (err) console.log(err);
    else console.log('success');
})

exports.getElephantLocusGroups = (req,res) =>{
    let sql = "select distinct left(locusnum,5) from egypt.elephant;";
    pool.query(sql, (err, response, fields) => {
        res.status(200).send(response);
    })
}


exports.getKhppVesselGroups = (req,res) =>{
       let sql = "select distinct left(k.vesselid,5) from egypt.khppdiagnostics k;";
       pool.query(sql, (err, response, fields) => {
           res.status(200).send(response);
       })
   }

//    -- Select Distinct vessel unit numbers  
// select distinct substring(vesselid, 7,3) from egypt.khppdiagnostics k;

exports.getKhppVesselLocusGroups = (req,res) =>{
       let sql = "select distinct substring(vesselid, 7,3) from egypt.khppdiagnostics k;";
       pool.query(sql, (err, response, fields) => {
           res.status(200).send(response);
       })
   }
exports.getKhppLocus