
/**Node Packages and Global Object - Declaration / Instantiation */
let express                    = require('express');
let router                     = express.Router();
let Reds =require('../models/Reds.js');
let Elephants =require('../models/Elephant.js');
let mySql                       = require('mySql');
let elephantData = require('../elephant');
let redData = require('../reds');
let _ = require('lodash');
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
//1.5 Total Percentage and Weight Percentage 
exports.totalWeightCountPerFabric = (req,res) => {
    pool.query(`select fabric, Round(( count(weight) / (select count(weight) from egypt.elephant)),2) as 'totalPercent'  ,Round(( sum(weight) / (select sum(weight) from egypt.elephant) ),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err,response,fields) => {
        let categorized, grouped, accumulated = [];
        const marl = 'Marl';
        const ns1 = 'NS I';
        const ns2 = 'NS II';
        const ns3 = 'NS III';
        const ns5 = 'NS V';
        const other  = 'Other';
        //Categorize fabrics into 6 Categories and assign them to newResponse
        categorized = response.map(item=>{
            switch(item.fabric){
                case 'M I':
                item.fabric = marl;
                break;
                case 'M II':
                item.fabric = marl;
                break;  
                case 'M III':
                item.fabric = marl;
                break; 
                case 'M IV':
                item.fabric = marl;
                break; 
                case 'M other':
                item.fabric = marl;
                break; 
                case 'NS I':
                item.fabric = ns1;
                break; 
                case 'NS I.b':
                item.fabric = ns1;
                break;
                case 'NS I.s':
                item.fabric = ns1;
                break;  
                case 'NS I.v':
                item.fabric = ns1;
                break; 
                case 'NS II':
                item.fabric = ns2;
                break; 
                case 'NS II+':
                item.fabric = ns2;
                break; 
                case 'NS III':
                item.fabric = ns3;
                break; 
                case 'NS V':
                item.fabric = ns5;
                break; 
                default:
                item.fabric = 'Empty';
                break;
            }
            return item;
        })
        //Group the categorized array by fabrics
         grouped = _.groupBy(categorized,(o)=>{return o.fabric})
        // for each Key in the Object
        for(let i = 0 ; i < _.keys(grouped).length ; i ++){
            let newItem;
            let key = _.keys(grouped)[i];

            // create a new object with properties type, weight, count
            newItem= {
                type:key,
                weight: _.sumBy(grouped[key],(o)=>{return o.weightPercent}),
                count: _.sumBy(grouped[key],(o)=>{return o.totalPercent}),
            }
            // add that item to the accumulated array 
            accumulated[i] = newItem;
        }
        //return the accumulated array to client
        res.send(accumulated);
    });
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
