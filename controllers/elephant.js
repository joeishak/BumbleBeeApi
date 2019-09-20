
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let mySql = require('mysql');
let _ = require('lodash');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
let config = require('../jrconfig.js');

let categorized, grouped, accumulated = [];
const pool = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    if (err) console.log(err);
    else console.log('success');
})

exports.allElephant = (req, res, next) => {
    pool.query('select * from egypt.elephantine;', (err, response, fields) => {
        res.status(200).send(response);
    });
};

//Panel 1 Total Percentage and Weight Percentage 
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
            res.status(200).send(accumulated);
        } else {
            res.status(404).send('Resource not found');
        }
    });
}
// 4, 5, 6, 7, 8 & 9 Count for Panel 2 A
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

                // console.log(key);
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


            res.status(200).send({
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            });
        }
    })
}
// 4, 5, 6, 7, 8 & 9 Weight for Panel 2 B
exports.percentOfFabricWeightBlackened = (req, res, next) => {
    let intArr, extArr, nullArr, bothArr = [];
    pool.query(`select  blackened, fabric, Round(( sum(weight) / (select sum(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant  group by blackened,fabric order by 1,2 asc;`, (err, response, fields) => {
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

                // console.log(key);
                let marl = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'Marl') {
                    if(!o.weightPercent){
                        return 0;
                    }
                    return o.weightPercent;
                };

                });
                let ns1 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS I') return o.weightPercent});
                let ns2 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS II') return o.weightPercent});
                let ns3 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS III') return o.weightPercent});
                // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
                let ns5 = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'NS V') return o.weightPercent});
                let empty = _.sumBy(grouped[key],(o) =>{if(o.fabric === 'Empty') return o.weightPercent});
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


            res.status(200).send({
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            });
        }
    })
}
// Panel 3 Proportion of count by type
exports.totalCountPerType = (req, res) => {
    pool.query(`select distinct typedescription 'type', Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant) * 100),2) as 'countPercent' from egypt.elephant group by  typedescription order by 2 desc;`, (err, response, fields) => {
        let bodySherds = _.groupBy(response,(o)=>{if(o.type==='body sherds' || o.type==='body sherd'){return 'sherds'}});
        let rim = _.groupBy(response,(o)=>{if(o.type==='rims tstc' ){return 'rimtstc'}});
        let hem = _.groupBy(response,(o)=>{if(o.type==='hem cup' || o.type==='hem cups'){return 'hemcups'}});
        let flattened  = _.groupBy(response,(o)=>{if(o.type==='flattened base'){return 'flatenedbase'}});

        let bodySum = _.sumBy(bodySherds.sherds, (o)=> {return o.countPercent});
        let rimSum = _.sumBy(rim.rimtstc, (o)=> {return o.countPercent});
        let hemSum= _.sumBy(hem.hemcups, (o)=> {return o.countPercent});
        let flattenedSum = _.sumBy(flattened.flatenedbase, (o)=> {return o.countPercent});

        // console.log(bodySum);
        let totalDefinedSum = bodySum + rimSum + hemSum + flattenedSum;
        let otherSum = 100 - totalDefinedSum;
        let model = [{
            stat: 'Body Sherds ',
            count: bodySum,
            color: '#0e5a7e'
          }, {
            stat: 'Rim Tstc',
            count: rimSum,
            color: '#166f99'
          }, {
            stat: 'Hem Cups ',
            count: hemSum,
            color: '#2185b4'
          }, {
            stat: 'Flattened Base',
            count: flattenedSum,
            color: '#319fd2'
          }, {
            stat: 'Other',
            count: otherSum,
            color: '#3eaee2'
          }];
          let newarr = _.sortBy(model, (o)=>{return o.count});
          res.status(200).send(newarr.reverse());
    })
}
// Panel 3 Proportion of count by type
exports.totalWeightPerType = (req, res) => {
    pool.query(`select distinct typedescription 'type', Round(( sum(weight) / (select sum(weight) from egypt.elephant) * 100),2) as 'weightPercent' from egypt.elephant group by  typedescription order by 2 desc;`, (err, response, fields) => {
        let bodySherds = _.groupBy(response,(o)=>{if(o.type==='body sherds' || o.type==='body sherd'){return 'sherds'}});
        let rim = _.groupBy(response,(o)=>{if(o.type==='rims tstc' ){return 'rimtstc'}});
        let hem = _.groupBy(response,(o)=>{if(o.type==='hem cup' || o.type==='hem cups'){return 'hemcups'}});
        let flattened  = _.groupBy(response,(o)=>{if(o.type==='flattened base'){return 'flatenedbase'}});

        let bodySum = _.sumBy(bodySherds.sherds, (o)=> {return o.weightPercent});
        let rimSum = _.sumBy(rim.rimtstc, (o)=> {return o.weightPercent});
        let hemSum= _.sumBy(hem.hemcups, (o)=> {return o.weightPercent});
        let flattenedSum = _.sumBy(flattened.flatenedbase, (o)=> {return o.weightPercent});

        // console.log(bodySum);
        let totalDefinedSum = bodySum + rimSum + hemSum + flattenedSum;
        let otherSum = 100 - totalDefinedSum;
        let model = [{
            stat: 'Body Sherds ',
            count: bodySum,
            color: '#0e5a7e'
          }, {
            stat: 'Rim Tstc',
            count: rimSum,
            color: '#166f99'
          }, {
            stat: 'Hem Cups ',
            count: hemSum,
            color: '#2185b4'
          }, {
            stat: 'Flattened Base',
            count: flattenedSum,
            color: '#319fd2'
          }, {
            stat: 'Other',
            count: otherSum,
            color: '#3eaee2'
          }];
          let newarr = _.sortBy(model, (o)=>{return o.count});
          res.status(200).send(newarr.reverse());
    })
}
// -- 1 Total Weight per fabric type
exports.totalWeightPerFabric = (req, res) => {
    pool.query(`select fabric, Round(( sum(weight) / (select sum(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant group by fabric order by 1;`, (err, response, fields) => {
        res.status(200).send(response);
    })
}

const convertArrayToSqlIn = (list) => {
    let oldText, concatText, newText; 

    for(let i = 0; i < list.length; i++){
        let item = list[i];
        newText = parseInt(item.text);
        if(oldText){
            concatText = `${concatText}, '${newText}'`
        }
        else{
            concatText = `'${newText}'`
        }

        oldText = newText;
    }
    // console.log(concatText)
    return concatText;
}
exports.locusLatLangs = (req,res) =>{
    // console.log(req.body);
  
    let sql = "Select distinct left(locusNum,5) 'locusgroup', lat, lang from egypt.elephant where left(locusNum,5) in ("+convertArrayToSqlIn(req.body) +");" ;
    pool.query(sql, (err, response, fields) => {
        // console.log(response);
        res.status(200).send(response);
    })
}
exports.getDetailTotals = (req,res,next) => {
 
    let totalArtifactSql = "Select count(*) 'totalArtifacts' from egypt.elephant where left(locusNum,5) in ("+convertArrayToSqlIn(req.body) +");";
    let totalWeightSql = "Select sum(weight) 'totalWeight' from egypt.elephant where left(locusNum,5) in ("+convertArrayToSqlIn(req.body) +");";
    let totalTypeSql = "Select count(distinct typeDescription)  'totalTypes' from egypt.elephant where left(locusNum,5) in ("+convertArrayToSqlIn(req.body) +");";
    let totalFabricSql = "Select count(distinct fabric) 'totalFabrics' from egypt.elephant where left(locusNum,5) in ("+convertArrayToSqlIn(req.body) +");";
    let returnBody = {
        artifact:0,
        weight:0,
        type:0,
        fabric:0
    }
    pool.query(totalArtifactSql,(err,response,fields)=>{
        
        returnBody.artifact = response[0].totalArtifacts;
        pool.query(totalWeightSql,(err,response1,fields)=>{
            returnBody.weight = response1[0].totalWeight;

            pool.query(totalTypeSql,(err,response2,fields)=>{
                returnBody.type = response2[0].totalTypes;

                pool.query(totalFabricSql,(err,response3,fields)=>{
                    returnBody.fabric = response3[0].totalFabrics;
                    res.send(returnBody);


                })
            })
        })
    })
}
exports.getDetailTable = (req,res,next)=>{
    let inArray = req.body.map(item=>{
        return item.text;
    })
    let sql = "Select * from egypt.elephant;";
    pool.query(sql, (err,response,fields)=>{
        res.send(response);
    })
}
exports.percentOfFabricTotalBlackenedByLocusGroup = (req,res) =>{
    let sql = "select  lat,lang, blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'totalPercent'  from egypt.elephant  group by lat,lang,blackened,fabric order by 1,2 asc;";
    pool.query(sql, (err, response, fields) => {
        res.status(200).send(response);
    })
}