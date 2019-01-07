
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let mySql = require('mySql');
let elephantData = require('../elephant');
let redData = require('../reds');
let _ = require('lodash');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
var config =
{
    user: "sa",
    password: "ft3t7pgz",
    host: "70.176.243.97",
    port: "3306",
    database: 'egypt'
}
const pool = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    if (err) console.log(err);
    else console.log('success');
})
let categorized, grouped, accumulated = [];


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
// ETL From JSon to MYSql
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
exports.allElephant = (req, res, next) => {
    pool.query('select * from egypt.elephantine;', (err, response, fields) => {
        res.send(response);
    });
};
exports.allRed = (req, res, next) => {
    pool.query('select * from egypt.reds;', (err, response, fields) => {
        res.send(response);
    });
};

// -- 1 Total Weight per fabric type
exports.totalWeightPerFabric = (req, res) => {
    pool.query(`select fabric, Round(( sum(weight) / (select sum(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err, response, fields) => {
        res.send(response);
    })
}
//1.5 Total Percentage and Weight Percentage 
exports.totalWeightCountPerFabric = (req, res) => {
    pool.query(`select fabric, Round(( count(weight) / (select count(weight) from egypt.elephant)),2) as 'totalPercent'  ,Round(( sum(weight) / (select sum(weight) from egypt.elephant) ),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err, response, fields) => {
        // const marl = 'Marl';
        // const ns1 = 'NS I';
        // const ns2 = 'NS II';
        // const ns3 = 'NS III';
        // const ns5 = 'NS V';
        // const other = 'Other';
        if (response !== undefined) {
            //Categorize fabrics into n Categories and assign them to newResponse
            categorized = response.map(item => {
                categorizeItemFabric(item);
                return item;
            })
            //Group the categorized array by fabrics
            grouped = _.groupBy(categorized, (o) => { return o.fabric })
            // for each Key in the Object
            for (let i = 0; i < _.keys(grouped).length; i++) {
                let newItem;
                let key = _.keys(grouped)[i];

                // create a new object with properties type, weight, count
                newItem = {
                    type: key,
                    weight: _.sumBy(grouped[key], (o) => { return o.weightPercent }),
                    count: _.sumBy(grouped[key], (o) => { return o.totalPercent }),
                }
                // add that item to the accumulated array 
                accumulated[i] = newItem;
            }
            //return the accumulated array to client
            res.send(accumulated);
        } else {
            res.status(404).send('Resource not found');
        }

    });
}

// -- 2 Count of records grouped by fabric type
exports.countOfWeightPerFabric = (req, res, next) => {
    pool.query(`select fabric, Round(( count(weight) / (select count(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err, response, fields) => {
        res.send(response);
    })
}

// --3 Percent of Diagnostics
exports.percentOfDiagnostics = (req, res, next) => {
    pool.query(`select distinct typedescription, Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by typedescription order by 2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}


// 4, 5, 6, 7, 8 & 9 all in one for Panel 2
exports.percentOfFabricTotalBlackened = (req, res, next) => {
    let intArr, extArr, nullArr, bothArr = [];
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'totalPercent'  from egypt.elephant  group by blackened,fabric order by 1,2 asc;`, (err, response, fields) => {
        if(response !== undefined){

            categorized  = response.map(item =>{
                categorizeItemFabric(item);
                return item;
            });


            grouped = _.groupBy(categorized,(o)=>{return o.blackened});

            // for each Key in the Object
            //ext/int/ int-ext / null
            for (let i = 0; i < _.keys(grouped).length; i++) {
                let newItem;
                let key = _.keys(grouped)[i];

                console.log(key);
                let marl = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'Marl') {
                    if(!o.totalPercent){
                        return 0;
                    }
                    return o.totalPercent;
                };

                });
                let ns1 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS I') return o.totalPercent});
                let ns2 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS II') return o.totalPercent});
                let ns3 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS III') return o.totalPercent});
                // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
                let ns5 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS V') return o.totalPercent});
                let empty = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'Empty') return o.totalPercent});
                switch(key){
                    case 'ext':
                        extArr=[marl||0,ns1||0,ns2||0,ns3||0,ns5||0,empty||0];
                        break;
                    case 'int':
                        intArr=[marl||0,ns1||0,ns2||0,ns3||0,ns5||0,empty||0];
                        break;
                    case 'int/ext':
                        bothArr=[marl||0,ns1||0,ns2||0,ns3||0,ns5||0,empty||0];
                        break;
                    default:
                        nullArr=[marl||0,ns1||0,ns2||0,ns3||0,ns5||0,empty||0];
                }



                
            }


            res.send({
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            });
        }
    })
}
//  -- 4 & 5 Percentage of a corpus within a given context that is fire-black on exterior.
exports.percentOfFireBlackenedExt = (req, res, next) => {
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'ext' group by blackened,fabric order by 2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}
// -- 4 & 5  Percentage of a corpus within a given context that is fire-black on exterior.
exports.countOfFireBlackenedExt = (req, res, next) => {
    pool.query(`select  blackened,fabric, Round(( sum(weight) / (select sum(weight)from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'ext' group by blackened,fabric order by 2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}

//-- 6 & 7	Percent of diagnostic corpus within a given context that is fire-black on exterior.
exports.percentOfFireBlackenedInt = (req, res, next) => {
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int' group by blackened,fabric order by 1,2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}
// -- 6 & 7  Percentage of a corpus within a given context that is fire-black on exterior.
exports.countOfFireBlackenedInt = (req, res, next) => {
    pool.query(`select  blackened,fabric, Round(( sum(weight) / (select sum(weight)from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int' group by blackened,fabric order by 2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}

// -- 8. & 9 Percentage of a corpus within a given context that is fire-black on exterior and interior.
exports.percentOfFireBlackenedIntExt = (req, res, next) => {
    pool.query(`select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int/ext' group by blackened,fabric order by 2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}
// -- 8. & 9
exports.countOfFireBlackenedIntExt = (req, res, next) => {
    pool.query(`select  blackened,fabric, Round(( sum(weight) / (select sum(weight)from egypt.elephant) * 100),2) as 'percent'  from egypt.elephant where blackened like 'int/ext' group by blackened,fabric order by 2 desc;`, (err, response, fields) => {
        res.send(response);
    })
}




// module.exports = router;
