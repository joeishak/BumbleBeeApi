
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
     user: "sa",
     password: "ft3t7pgz",
     host: "70.176.243.97",
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
    pool.query('select * from egypt.elephantine;',(err,response,fields)=>{
        res.send(response);
    });
};
exports.allRed = (req,res,next)=>{
    pool.query('select * from egypt.reds;',(err,response,fields)=>{
        res.send(response);
    });
};

// -- 1 Total Weight per fabric type
exports.totalWeightPerFabric = (req,res) => {
    pool.query(`select fabric, Round(( sum(weight) / (select sum(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err,response,fields) => {
        res.send(response);
    })
}
// -- 2 Count of records grouped by fabric type
exports.countOfWeightPerFabric = (req,res,next) => {
    pool.query(`select fabric, Round(( count(weight) / (select count(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err,response,fields) => {
        res.send(response);
    })
}

// --3 Percent of Diagnostics
exports.percentOfDiagnostics = (req,res,next) => {
    pool.query(`select distinct typedescription, Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by typedescription order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}
//  -- 4 & 5 Percentage of a corpus within a given context that is fire-black on exterior.
exports.percentOfFireBlackenedExt = (req,res,next) => {
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'ext' group by blackened,fabric order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}
// -- 4 & 5  Percentage of a corpus within a given context that is fire-black on exterior.
exports.countOfFireBlackenedExt = (req,res,next) => {
    pool.query(`select  blackened,fabric, Round(( sum(weight) / (select sum(weight)from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'ext' group by blackened,fabric order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}

//-- 6 & 7	Percent of diagnostic corpus within a given context that is fire-black on exterior.
exports.percentOfFireBlackenedInt = (req,res,next) => {
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int' group by blackened,fabric order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}
// -- 6 & 7  Percentage of a corpus within a given context that is fire-black on exterior.
exports.countOfFireBlackenedInt = (req,res,next) => {
    pool.query(`select  blackened,fabric, Round(( sum(weight) / (select sum(weight)from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int' group by blackened,fabric order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}

// -- 8. & 9 Percentage of a corpus within a given context that is fire-black on exterior and interior.
exports.percentOfFireBlackenedIntExt = (req,res,next) => {
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int/ext' group by blackened,fabric order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}
// -- 8. & 9
exports.countOfFireBlackenedIntExt = (req,res,next) => {
    pool.query(`select  blackened,fabric, Round(( sum(weight) / (select sum(weight)from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int/ext' group by blackened,fabric order by 2 desc;`, (err,response,fields) => {
        res.send(response);
    })
}




// module.exports = router;
