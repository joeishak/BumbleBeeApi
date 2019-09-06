
/**Node Packages and Global Object - Declaration / Instantiation */
let express = require('express');
let router = express.Router();
let Reds = require('../models/Reds.js');
let UnCleansedElephants = require('../models/UnCleansedElephants.js');
let mySql = require('mysql');

let _ = require('lodash');
let categorizeItemFabric = require('../services/categorizeFabrics.js');
let config = require('../jrconfig.js');
// let SiteLocations = require('../data/')
let categorized, grouped, accumulated = [];
const pool = new mySql.createConnection(config)
// Check for Errors
pool.connect(err => {
    // if (err) //('Error connecting to MySql');
    // else // //('');
})

exports.allElephant = (req, res, next) => {
    pool.query("select * from egypt.elephantine where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ");", (err, response, fields) => {
        res.send(response);
    });
};

// //Panel 1 Total Percentage and Weight Percentage 
// exports.totalWeightCountPerFabric = (req, res) => {
//     pool.query("select fabric, Round(( count(weight) / (select count(weight) from egypt.elephant)),2) as 'totalPercent'  ,Round(( sum(weight) / (select sum(weight) from egypt.elephant) ),2) as 'weightPercent'  from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ") group by fabric order by 1;", (err, response, fields) => {
//         // const marl = 'Marl';
//         // const ns1 = 'NS I';
//         // const ns2 = 'NS II';
//         // const ns3 = 'NS III';
//         // const ns5 = 'NS V';
//         // const other = 'Other';
//         if (response !== undefined) {
//             //Categorize fabrics into n Categories and assign them to newResponse
//             categorized = response.map(item => {
//                 categorizeItemFabric(item);
//                 return item;
//             })
//             //Group the categorized array by fabrics
//             grouped = _.groupBy(categorized, (o) => { return o.fabric })
//             // for each Key in the Object
//             for (let i = 0; i < _.keys(grouped).length; i++) {
//                 let newItem;
//                 let key = _.keys(grouped)[i];

//                 // create a new object with properties type, weight, count
//                 newItem = {
//                     type: key,
//                     weight: _.sumBy(grouped[key], (o) => { return o.weightPercent }),
//                     count: _.sumBy(grouped[key], (o) => { return o.totalPercent }),
//                 }
//                 // add that item to the accumulated array 
//                 accumulated[i] = newItem;
//             }
//             //return the accumulated array to client
//             res.send(accumulated);
//         } else {
//             res.status(404).send('Resource not found');
//         }
//     });
// }
// // 4, 5, 6, 7, 8 & 9 Count for Panel 2 A
// exports.percentOfFabricTotalBlackened = (req, res, next) => {
//     let intArr, extArr, nullArr, bothArr = [];
//     pool.query("select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'totalPercent'  from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ") group by blackened,fabric order by 1,2 asc;", (err, response, fields) => {
//         if (response !== undefined) {

//             categorized = response.map(item => {
//                 categorizeItemFabric(item);
//                 return item;
//             });


//             grouped = _.groupBy(categorized, (o) => { return o.blackened });

//             // for each Key in the Object
//             //ext/int/ int-ext / null
//             for (let i = 0; i < _.keys(grouped).length; i++) {
//                 let newItem;
//                 let key = _.keys(grouped)[i];

//                 // //(key);
//                 let marl = _.sumBy(grouped[key], (o) => {
//                     if (o.fabric === 'Marl') {
//                         if (!o.totalPercent) {
//                             return 0;
//                         }
//                         return o.totalPercent;
//                     };

//                 });
//                 let ns1 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS I') return o.totalPercent });
//                 let ns2 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS II') return o.totalPercent });
//                 let ns3 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS III') return o.totalPercent });
//                 // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
//                 let ns5 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS V') return o.totalPercent });
//                 let empty = _.sumBy(grouped[key], (o) => { if (o.fabric === 'Empty') return o.totalPercent });
//                 switch (key) {
//                     case 'ext':
//                         extArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                         break;
//                     case 'int':
//                         intArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                         break;
//                     case 'int/ext':
//                         bothArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                         break;
//                     default:
//                         nullArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                 }




//             }


//             res.send({
//                 exterior: extArr,
//                 interior: intArr,
//                 both: bothArr,
//                 empty: nullArr
//             });
//         }
//     })
// }
// // 4, 5, 6, 7, 8 & 9 Weight for Panel 2 B
// exports.percentOfFabricWeightBlackened = (req, res, next) => {
//     let intArr, extArr, nullArr, bothArr = [];
//     pool.query("select  blackened, fabric, Round(( sum(weight) / (select sum(weight) from egypt.elephant) * 100),2) as 'weightPercent'  from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ") group by blackened,fabric order by 1,2 asc;", (err, response, fields) => {
//         if (response !== undefined) {

//             categorized = response.map(item => {
//                 categorizeItemFabric(item);
//                 return item;
//             });


//             grouped = _.groupBy(categorized, (o) => { return o.blackened });

//             // for each Key in the Object
//             //ext/int/ int-ext / null
//             for (let i = 0; i < _.keys(grouped).length; i++) {
//                 let newItem;
//                 let key = _.keys(grouped)[i];

//                 // //(key);
//                 let marl = _.sumBy(grouped[key], (o) => {
//                     if (o.fabric === 'Marl') {
//                         if (!o.weightPercent) {
//                             return 0;
//                         }
//                         return o.weightPercent;
//                     };

//                 });
//                 let ns1 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS I') return o.weightPercent });
//                 let ns2 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS II') return o.weightPercent });
//                 let ns3 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS III') return o.weightPercent });
//                 // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
//                 let ns5 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS V') return o.weightPercent });
//                 let empty = _.sumBy(grouped[key], (o) => { if (o.fabric === 'Empty') return o.weightPercent });
//                 switch (key) {
//                     case 'ext':
//                         extArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                         break;
//                     case 'int':
//                         intArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                         break;
//                     case 'int/ext':
//                         bothArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                         break;
//                     default:
//                         nullArr = [marl || 0, ns1 || 0, ns2 || 0, ns3 || 0, ns5 || 0, empty || 0];
//                 }




//             }


//             res.send({
//                 exterior: extArr,
//                 interior: intArr,
//                 both: bothArr,
//                 empty: nullArr
//             });
//         }
//     })
// }
// // Panel 3 Proportion of count by type
// exports.totalCountPerType = (req, res) => {
//     pool.query("select distinct typedescription 'type', Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant) * 100),2) as 'countPercent' from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ") group by  typedescription order by 2 desc;", (err, response, fields) => {
//         let bodySherds = _.groupBy(response, (o) => { if (o.type === 'body sherds' || o.type === 'body sherd') { return 'sherds' } });
//         let rim = _.groupBy(response, (o) => { if (o.type === 'rims tstc') { return 'rimtstc' } });
//         let hem = _.groupBy(response, (o) => { if (o.type === 'hem cup' || o.type === 'hem cups') { return 'hemcups' } });
//         let flattened = _.groupBy(response, (o) => { if (o.type === 'flattened base') { return 'flatenedbase' } });

//         let bodySum = _.sumBy(bodySherds.sherds, (o) => { return o.countPercent });
//         let rimSum = _.sumBy(rim.rimtstc, (o) => { return o.countPercent });
//         let hemSum = _.sumBy(hem.hemcups, (o) => { return o.countPercent });
//         let flattenedSum = _.sumBy(flattened.flatenedbase, (o) => { return o.countPercent });

//         // //(bodySum);
//         let totalDefinedSum = bodySum + rimSum + hemSum + flattenedSum;
//         let otherSum = 100 - totalDefinedSum;
//         let model = [{
//             stat: 'Body Sherds ',
//             count: bodySum,
//             color: '#0e5a7e'
//         }, {
//             stat: 'Rim Tstc',
//             count: rimSum,
//             color: '#166f99'
//         }, {
//             stat: 'Hem Cups ',
//             count: hemSum,
//             color: '#2185b4'
//         }, {
//             stat: 'Flattened Base',
//             count: flattenedSum,
//             color: '#319fd2'
//         }, {
//             stat: 'Other',
//             count: otherSum,
//             color: '#3eaee2'
//         }];
//         let newarr = _.sortBy(model, (o) => { return o.count });
//         res.send(newarr.reverse());
//     })
// }
// // Panel 3 Proportion of count by type
// exports.totalWeightPerType = (req, res) => {
//     pool.query("select distinct typedescription 'type', Round(( sum(weight) / (select sum(weight)  from egypt.elephant) * 100),2) as 'weightPercent' from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ") group by  typedescription order by 2 desc;", (err, response, fields) => {
//         let bodySherds = _.groupBy(response, (o) => { if (o.type === 'body sherds' || o.type === 'body sherd') { return 'sherds' } });
//         let rim = _.groupBy(response, (o) => { if (o.type === 'rims tstc') { return 'rimtstc' } });
//         let hem = _.groupBy(response, (o) => { if (o.type === 'hem cup' || o.type === 'hem cups') { return 'hemcups' } });
//         let flattened = _.groupBy(response, (o) => { if (o.type === 'flattened base') { return 'flatenedbase' } });

//         let bodySum = _.sumBy(bodySherds.sherds, (o) => { return o.weightPercent });
//         let rimSum = _.sumBy(rim.rimtstc, (o) => { return o.weightPercent });
//         let hemSum = _.sumBy(hem.hemcups, (o) => { return o.weightPercent });
//         let flattenedSum = _.sumBy(flattened.flatenedbase, (o) => { return o.weightPercent });

//         // //(bodySum);
//         let totalDefinedSum = bodySum + rimSum + hemSum + flattenedSum;
//         let otherSum = 100 - totalDefinedSum;
//         let model = [{
//             stat: 'Body Sherds ',
//             count: bodySum,
//             color: '#0e5a7e'
//         }, {
//             stat: 'Rim Tstc',
//             count: rimSum,
//             color: '#166f99'
//         }, {
//             stat: 'Hem Cups ',
//             count: hemSum,
//             color: '#2185b4'
//         }, {
//             stat: 'Flattened Base',
//             count: flattenedSum,
//             color: '#319fd2'
//         }, {
//             stat: 'Other',
//             count: otherSum,
//             color: '#3eaee2'
//         }];
//         let newarr = _.sortBy(model, (o) => { return o.count });
//         res.send(newarr.reverse());
//     })
// }
const convertArrayToSqlIn = (list) => {
    let oldText, concatText, newText;
    
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        newText = parseInt(item.text);
        if (oldText) {
            concatText = `${concatText}, '${newText}'`
        }
        else {
            concatText = `'${newText}'`
        }

        oldText = newText;
    }
    ////(concatText)
    return concatText;
}
const convertLocusArrayToSqlIn = (list) => {
    let oldText, concatText, newText;

    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        newText = item['locusnum'];
        if (oldText) {
            concatText = `${concatText}, '${newText}'`
        }
        else {
            concatText = `'${newText}'`
        }

        oldText = newText;
    }
    //(concatText)
    return concatText;
}
const convertTagsArrayToSqlIn = (list) => {
    let oldText, concatText, newText;

    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        newText = item['tagNumber'];
        if (oldText) {
            concatText = `${concatText}, '${newText}'`
        }
        else {
            concatText = `'${newText}'`
        }

        oldText = newText;
    }
    ////(concatText)
    return concatText;
}
exports.locusLatLangs = (req, res) => {
    //('Getting Lat Langs');

    let sql = "Select distinct left(locusNum,5) 'locusgroup', lat, lang from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ");";
    //('THE SQL:', sql);

    pool.query(sql, (err, response, fields) => {
        //(response);
        res.send(response);
    })
}
exports.getDetailTotals = (req, res, next) => {

    let totalArtifactSql = "Select count(*) 'totalArtifacts' from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ");";
    let totalWeightSql = "Select sum(weight) 'totalWeight' from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ");";
    let totalTypeSql = "Select count(distinct typeDescription)  'totalTypes' from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ");";
    let totalFabricSql = "Select count(distinct fabric) 'totalFabrics' from egypt.elephant where left(locusNum,5) in (" + convertArrayToSqlIn(req.body) + ");";
    let returnBody = {
        artifact: 0,
        weight: 0,
        type: 0,
        fabric: 0
    }
    pool.query(totalArtifactSql, (err, response, fields) => {

        returnBody.artifact = response[0].totalArtifacts;
        pool.query(totalWeightSql, (err, response1, fields) => {
            returnBody.weight = response1[0].totalWeight;

            pool.query(totalTypeSql, (err, response2, fields) => {
                returnBody.type = response2[0].totalTypes;

                pool.query(totalFabricSql, (err, response3, fields) => {
                    returnBody.fabric = response3[0].totalFabrics;
                    res.send(returnBody);


                })
            })
        })
    })
}
exports.getDetailTable = (req, res, next) => {
    let inArray = req.body.map(item => {
        return item.text;
    })
    let sql = "Select * from egypt.elephant;";
    pool.query(sql, (err, response, fields) => {
        res.send(response);
    })
}
exports.getLocusNumbers = (req, res, next) => {
    let eleSql = "select distinct locusnum from egypt.elephant;"
    let khppSql = "select distinct tagNumber from egypt.khppform ";


    pool.query(eleSql, (err, response, field) => {

        pool.query(khppSql, (err, khpp, field) => {
            res.send({
                ele: response,
                khpp: khpp
            })
        })
    })
}
exports.totalCountPerType = (req, res) => {
    //// console.log('Body from type count', req.body.length);

    let sql = `select distinct typeDescription 'type', Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' ) ),4) as 'countPercent' from egypt.elephant   
    where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' 
    and  locusnum in (${convertLocusArrayToSqlIn(req.body)}) group by  typeDescription order by 2 desc;`
    let sql1 = `select distinct typeNum 'stat', count(typeDescription) as 'count',
    Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' ) ),4) as 'countPercent' from egypt.elephant   
    where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' 
    and  locusnum in (${convertLocusArrayToSqlIn(req.body)})
    group by  typeNum order by 2 desc;`

    pool.query(sql1, (err, response, fields) => {
        let empty = _.groupBy(response, (o) => { if (o.type === 'null') { return 'null' } });
        let OB11 = _.groupBy(response, (o) => { if (o.type === 'O.B1.1') { return 'ob11' } });
        let Om2 = _.groupBy(response, (o) => { if (o.type === 'O.m.2') { return 'om2' } });

        let ob12 = _.groupBy(response, (o) => { if (o.type === 'O.B1.2') { return 'ob12' } });
        let b1a = _.groupBy(response, (o) => { if (o.type === 'B.1a') { return 'b1a' } });
        let b3 = _.groupBy(response, (o) => { if (o.type === 'B.3') { return 'b3' } });
        let om1 = _.groupBy(response, (o) => { if (o.type === 'O.m.1') { return 'om1' } });
        let b2a = _.groupBy(response, (o) => { if (o.type === 'B.2a') { return 'b2a' } });

        let od12 = _.groupBy(response, (o) => { if (o.type === 'O.D1.2') { return 'od12' } });
        let om3 = _.groupBy(response, (o) => { if (o.type === 'O.m.3') { return 'om3' } });



        let emptySum = _.sumBy(empty.null, (o) => { return o.countPercent, o.count });
        let ob1Sum = _.sumBy(OB11.ob11, (o) => { return o.countPercent, o.count });
        let om2Sum = _.sumBy(Om2.om2, (o) => { return o.countPercent, o.count });
        let ob12Sum = _.sumBy(ob12.ob12, (o) => { return o.countPercent, o.count });
        let b1aSum = _.sumBy(b1a.b1a, (o) => { return o.countPercent, o.count });
        let b3Sum = _.sumBy(b3.b3, (o) => { return o.countPercent, o.count });
        let om1Sum = _.sumBy(om1.om1, (o) => { return o.countPercent, o.count });
        let b2aSum = _.sumBy(b2a.b2a, (o) => { return o.countPercent, o.count });
        let od12sum = _.sumBy(od12.od12, (o) => { return o.countPercent, o.count });
        let om3Sum = _.sumBy(om3.om3, (o) => { return o.countPercent, o.count });




        //  empty = (empty.null)  ? empty.null : [{type:'null',count:0,countPercent:0}];
        //  OB11 = (OB11.ob11)  ? OB11.ob11 :    [{type:'ob11',count:0,countPercent:0}];
        //  Om2 = (Om2.om2)  ? Om2.om2 :         [{type:'om2',count:0,countPercent:0}];
        //  ob12 = (ob12.ob12)  ? ob12.ob12 :    [{type:'ob12',count:0,countPercent:0}];
        //  b1a = (b1a.b1a)  ? b1a.b1a :         [{type:'b1a',count:0,countPercent:0}];
        //  b3 = (b3.b3)  ? b3.b3 :              [{type:'b3',count:0,countPercent:0}];
        //  om1 = (om1.om1)  ? om1.om1 :         [{type:'om1',count:0,countPercent:0}];
        //  b2a = (b2a.b2a)  ? b2a.b2a :         [{type:'b2a',count:0,countPercent:0}];
        //  od12 = (od12.od12)  ? od12.od12 :    [{type:'od12',count:0,countPercent:0}];
        //  om3 = (om3.om3)  ? om3.om3 :         [{type:'om3',count:0,countPercent:0}];


        // //(bodySum);
        let model = [{
            stat: 'Null',
            count: empty.null ? empty.null[0].count : 0,
            countPercent: empty.null ? empty.null[0].countPercent : 0,
            color: '#166f99'
        }/* {
                stat: 'BS',
                count: bsSum,
                color: '#166f99'
            } */, {
            stat: '0.B1.1',
            count: OB11.ob11 ? OB11.ob11[0].count : 0,
            countPercent: OB11.ob11 ? OB11.ob11[0].countPercent : 0,

            color: '#2185b4'
        }, {
            stat: 'O.m.2',
            count: Om2.om2 ? Om2.om2[0].count : 0,
            countPercent: Om2.om2 ? Om2.om2[0].countPercent : 0,

            color: '#319fd2'
        },
        {
            stat: 'O.B1.2',
            count: ob12.ob12 ? ob12.ob12[0].count : 0,
            countPercent: ob12.ob12 ? ob12.ob12[0].countPercent : 0,

            color: '#166f99'
        }, {
            stat: 'B.1a',
            count: b1a.b1a ? b1a.b1a[0].count : 0,
            countPercent: b1a.b1a ? b1a.b1a[0].countPercent : 0,

            color: '#166f99'
        }, {
            stat: 'B.3',
            count: b1a.b1a ? b1a.b1a[0].count : 0,
            countPercent: b1a.b1a ? b1a.b1a[0].countPercent : 0,

            color: '#2185b4'
        }, {
            stat: 'O.m.1',
            count: om1.om1 ? om1.om1[0].count : 0,
            countPercent: om1.om1 ? om1.om1[0].countPercent : 0,

            color: '#319fd2'
        }, {
            stat: 'B.2a',
            count: b2a.b2a ? b2a.b2a[0].count : 0,
            countPercent: b2a.b2a ? b2a.b2a[0].countPercent : 0,

            color: '#3eaee2'
        },
        {
            stat: 'O.D1.2',
            count: od12.od12 ? od12.od12[0].count : 0,
            countPercent: od12.od12 ? od12.od12[0].countPercent : 0,

            color: '#319fd2'
        }, {
            stat: 'O.m.3',
            count: om3.om3 ? om3.om3[0].count : 0,
            countPercent: om3.om3 ? om3.om3[0].countPercent : 0,

            color: '#3eaee2'
        }];
        let newarr = _.sortBy(model, (o) => { return o.count });
        res.send(response);
    })
}
exports.totalWeightPerType = (req, res) => {
    let sql = `select distinct typeDescription 'type', Round(( count(typeDescription) / (select count(typeDescription) from egypt.elephant where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' ) ),4) as 'countPercent' from egypt.elephant   
    where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' 
    and  locusnum in (${convertLocusArrayToSqlIn(req.body)}) group by  typeDescription order by 2 desc;`
    let sql1 = `select distinct typeNum 'stat', sum(weight) as 'count',
    Round(( sum(weight) / (select sum(weight) from egypt.elephant where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' ) ),4) as 'countPercent' from egypt.elephant   
    where typeDescription not like'%body sherd%'
    and typeDescription  not like '%decorated%' 
    and  locusnum in (${convertLocusArrayToSqlIn(req.body)})
    group by  typeNum order by 2 desc;`
    pool.query(sql1, (err, response, fields) => {
        let empty = _.groupBy(response, (o) => { if (o.type === 'null') { return 'null' } });
        let OB11 = _.groupBy(response, (o) => { if (o.type === 'O.B1.1') { return 'ob11' } });
        let Om2 = _.groupBy(response, (o) => { if (o.type === 'O.m.2') { return 'om2' } });

        let ob12 = _.groupBy(response, (o) => { if (o.type === 'O.B1.2') { return 'ob12' } });
        let b1a = _.groupBy(response, (o) => { if (o.type === 'B.1a') { return 'b1a' } });
        let b3 = _.groupBy(response, (o) => { if (o.type === 'B.3') { return 'b3' } });
        let om1 = _.groupBy(response, (o) => { if (o.type === 'O.m.1') { return 'om1' } });
        let b2a = _.groupBy(response, (o) => { if (o.type === 'B.2a') { return 'b2a' } });

        let od12 = _.groupBy(response, (o) => { if (o.type === 'O.D1.2') { return 'od12' } });
        let om3 = _.groupBy(response, (o) => { if (o.type === 'O.m.3') { return 'om3' } });

        let emptySum = _.sumBy(empty.null, (o) => { return o.countPercent, o.count });
        let ob1Sum = _.sumBy(OB11.ob11, (o) => { return o.countPercent, o.count });
        let om2Sum = _.sumBy(Om2.om2, (o) => { return o.countPercent, o.count });
        let ob12Sum = _.sumBy(ob12.ob12, (o) => { return o.countPercent, o.count });
        let b1aSum = _.sumBy(b1a.b1a, (o) => { return o.countPercent, o.count });
        let b3Sum = _.sumBy(b3.b3, (o) => { return o.countPercent, o.count });
        let om1Sum = _.sumBy(om1.om1, (o) => { return o.countPercent, o.count });
        let b2aSum = _.sumBy(b2a.b2a, (o) => { return o.countPercent, o.count });
        let od12sum = _.sumBy(od12.od12, (o) => { return o.countPercent, o.count });
        let om3Sum = _.sumBy(om3.om3, (o) => { return o.countPercent, o.count });




        // //(bodySum);
        let model = [{
            stat: 'Null',
            count: empty.null ? empty.null[0].count : 0,
            countPercent: empty.null ? empty.null[0].countPercent : 0,
            color: '#166f99'
        }/* {
                stat: 'BS',
                count: bsSum,
                color: '#166f99'
            } */, {
            stat: '0.B1.1',
            count: OB11.ob11 ? OB11.ob11[0].count : 0,
            countPercent: OB11.ob11 ? OB11.ob11[0].countPercent : 0,

            color: '#2185b4'
        }, {
            stat: 'O.m.2',
            count: Om2.om2 ? Om2.om2[0].count : 0,
            countPercent: Om2.om2 ? Om2.om2[0].countPercent : 0,

            color: '#319fd2'
        },
        {
            stat: 'O.B1.2',
            count: ob12.ob12 ? ob12.ob12[0].count : 0,
            countPercent: ob12.ob12 ? ob12.ob12[0].countPercent : 0,

            color: '#166f99'
        }, {
            stat: 'B.1a',
            count: b1a.b1a ? b1a.b1a[0].count : 0,
            countPercent: b1a.b1a ? b1a.b1a[0].countPercent : 0,

            color: '#166f99'
        }, {
            stat: 'B.3',
            count: b1a.b1a ? b1a.b1a[0].count : 0,
            countPercent: b1a.b1a ? b1a.b1a[0].countPercent : 0,

            color: '#2185b4'
        }, {
            stat: 'O.m.1',
            count: om1.om1 ? om1.om1[0].count : 0,
            countPercent: om1.om1 ? om1.om1[0].countPercent : 0,

            color: '#319fd2'
        }, {
            stat: 'B.2a',
            count: b2a.b2a ? b2a.b2a[0].count : 0,
            countPercent: b2a.b2a ? b2a.b2a[0].countPercent : 0,

            color: '#3eaee2'
        },
        {
            stat: 'O.D1.2',
            count: od12.od12 ? od12.od12[0].count : 0,
            countPercent: od12.od12 ? od12.od12[0].countPercent : 0,

            color: '#319fd2'
        }, {
            stat: 'O.m.3',
            count: om3.om3 ? om3.om3[0].count : 0,
            countPercent: om3.om3 ? om3.om3[0].countPercent : 0,

            color: '#3eaee2'
        }];
        let newarr = _.sortBy(model, (o) => { return o.count });
        res.send(response);
        // res.send(newarr.reverse());
    })
}
exports.totalWeightCountPerFabric = (req, res) => {
    ('Body from Fabrics Weight ', req.body.length);

    pool.query("select fabric, count(weight) as 'Total', sum(weight) as 'Weight', Round(( count(weight) / (select count(weight) from egypt.elephant)),2) as 'totalPercent'  ,Round(( sum(weight) / (select sum(weight) from egypt.elephant) ),2) as 'weightPercent'  from egypt.elephant where locusNum in (" + convertLocusArrayToSqlIn(req.body) + ") group by fabric order by 1;", (err, response, fields) => {
        // const marl = 'Marl';
        // const ns1 = 'NS I';
        // const ns2 = 'NS II';
        // const ns3 = 'NS III';
        // const ns5 = 'NS V';
        // const other = 'Other';
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
                weight: _.sumBy(grouped[key], (o) => { return o.Weight }),
                count: _.sumBy(grouped[key], (o) => { return o.Total }),
                weightPercent: _.sumBy(grouped[key], (o) => { return o.weightPercent }),
                countPercent: _.sumBy(grouped[key], (o) => { return o.totalPercent }),
            }
            // add that item to the accumulated array 
            accumulated[i] = newItem;
        }
        //return the accumulated array to client
        // ('Accumulated');
        // (accumulated);
        res.send(accumulated);

    });
}
exports.percentOfFabricTotalBlackened = (req, res, next) => {
    // ('Body from Fabrics Total Blackened' + " select  blackened, fabric, Round(( count(blackened) / (select count(blackened) from egypt.elephant) * 100),2) as 'totalPercent'  from egypt.elephant where locusNum in (" + convertLocusArrayToSqlIn(req.body) + ") group by blackened,fabric order by 1,2 asc;");
    let intArr, extArr, nullArr, bothArr = [];
    pool.query("select  blackened, fabric, count(*) 'count' , Round(( count(weight) / (select count(weight) from egypt.elephant)),2) as 'totalPercent'  from egypt.elephant where locusNum in (" + convertLocusArrayToSqlIn(req.body) + ") group by blackened,fabric order by 1,2 asc;", (err, response, fields) => {


        if (response !== undefined) {

            categorized = response.map(item => {
                categorizeItemFabric(item);
                return item;
            });


            grouped = _.groupBy(categorized, (o) => { return o.blackened });

            console.log(grouped);
            // for each Key in the Object get the total Percent
            //ext/int/ int-ext / null
            for (let i = 0; i < _.keys(grouped).length; i++) {
                let newItem;
                let key = _.keys(grouped)[i];

                // //(key);
                let marl = _.sumBy(grouped[key], (o) => {
                    if (o.fabric === 'Marl') {
                        if (!o.count) {
                            return 0;
                        }
                        return o.count;
                    };

                });
                let ns1 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS I') return o.count });
                let ns2 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS II+') return o.count });
                // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
                let empty = _.sumBy(grouped[key], (o) => { if (o.fabric === 'Empty') return o.count });
                switch (key) {
                    case 'ext':
                        extArr = [marl || 0, ns1 || 0, ns2 || 0, empty || 0];
                        break;
                    case 'int':
                        intArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int/ext':
                        bothArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    default:
                        nullArr = [marl || 0, ns1 || 0, ns2 || 0, empty || 0];
                }




            }
            let values = {
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            };

            // for each Key in the Object get the total Percent
            //ext/int/ int-ext / null
            for (let i = 0; i < _.keys(grouped).length; i++) {
                let newItem;
                let key = _.keys(grouped)[i];

                // //(key);
                let marl = _.sumBy(grouped[key], (o) => {
                    if (o.fabric === 'Marl') {
                        if (!o.totalPercent) {
                            return 0;
                        }
                        return o.totalPercent;
                    };

                });
                let ns1 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS I') return o.totalPercent });
                let ns2 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS II+') return o.totalPercent });
                // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
                let empty = _.sumBy(grouped[key], (o) => { if (o.fabric === 'Empty') return o.totalPercent });
                switch (key) {
                    case 'ext':
                        extArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int':
                        intArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int/ext':
                        bothArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    default:
                        nullArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                }




            }
            let placeholders = {
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            }

            res.send([values, placeholders]);
        }
    })
}
exports.percentOfFabricWeightBlackened = (req, res, next) => {
    // ('Body from Fabrics weight Blackened', req.body.length);
    let intArr, extArr, nullArr, bothArr = [];
    pool.query("select  blackened, fabric, sum(weight) as 'weight',Round(( sum(weight) / (select sum(weight) from egypt.elephant) ),2) as 'weightPercent' from egypt.elephant where locusNum in (" + convertLocusArrayToSqlIn(req.body) + ") group by blackened,fabric order by 1,2 asc;", (err, response, fields) => {
        if (response !== undefined) {

            categorized = response.map(item => {
                categorizeItemFabric(item);
                return item;
            });


            grouped = _.groupBy(categorized, (o) => { return o.blackened });

            // for each Key in the Object
            //ext/int/ int-ext / null
            for (let i = 0; i < _.keys(grouped).length; i++) {
                let newItem;
                let key = _.keys(grouped)[i];

                // //(key);
                let marl = _.sumBy(grouped[key], (o) => {
                    if (o.fabric === 'Marl') {
                        if (!o.weight) {
                            return 0;
                        }
                        return o.weight;
                    };

                });
                let ns1 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS I') return o.weight });
                let ns2 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS II+') return o.weight });
                // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
                let empty = _.sumBy(grouped[key], (o) => { if (o.fabric === 'Empty') return o.weight });
                switch (key) {
                    case 'ext':
                        extArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int':
                        intArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int/ext':
                        bothArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    default:
                        nullArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                }




            }
            let values = {
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            }
            // for each Key in the Object get the total Percent
            //ext/int/ int-ext / null
            for (let i = 0; i < _.keys(grouped).length; i++) {
                let newItem;
                let key = _.keys(grouped)[i];

                // //(key);
                let marl = _.sumBy(grouped[key], (o) => {
                    if (o.fabric === 'Marl') {
                        if (!o.weightPercent) {
                            return 0;
                        }
                        return o.weightPercent;
                    };

                });
                let ns1 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS I') return o.weightPercent });
                let ns2 = _.sumBy(grouped[key], (o) => { if (o.fabric === 'NS II+') return o.weightPercent });
                // let ns4 = _.sumBy(grouped[key],(o) =>{return o.fabric === 'NS IV'}); 
                let empty = _.sumBy(grouped[key], (o) => { if (o.fabric === 'Empty') return o.weightPercent });
                switch (key) {
                    case 'ext':
                        extArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int':
                        intArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    case 'int/ext':
                        bothArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                        break;
                    default:
                        nullArr = [marl || 0, ns1 || 0, ns2 || 0,  empty || 0];
                }




            }
            let placeholders = {
                exterior: extArr,
                interior: intArr,
                both: bothArr,
                empty: nullArr
            }

            res.send([values, placeholders]);
        }
    })
}
exports.compareFabrics = (req, res, next) => {
    // ('Body from Surface Comparison', req.body.length);

    (req.body);
    let eleFilters = req.body.filter(item => item.hasOwnProperty('locusnum'));
    let khppFilters = req.body.filter(item => item.hasOwnProperty('tagNumber'));

    // (khppFilters);
    let eleSql = `SELECT sfCoating, count(*) as 'Count', (count(*)/ (Select count(*) from egypt.elephant) )  as 'CountProportion'  FROM egypt.elephant where locusNum in (${convertLocusArrayToSqlIn(eleFilters)}) group by sfCoating;`;
    let khppSql = `SELECT surfaceTreatment, count(*) as 'Count', (count(*)/ (Select count(*) from egypt.khppbodysherds) )  as 'CountProportion'  FROM egypt.khppbodysherds t, egypt.khppform f
    where t.formid = f.id 
    and tagNumber in (${convertTagsArrayToSqlIn(khppFilters)}) group by surfaceTreatment;`;

    // console.log('Ele Sql', eleSql);
    // console.log('KHP Sql ', khppSql);
    pool.query(eleSql, (err, eleData, fields) => {

        pool.query(khppSql, (err, khppData, fields) => {

            // (eleData);
            // (khppData);

            let responseObj = {
                rSlipIn: [
                    (_.find(eleData, (item => { return item.sfCoating === 'red slip in' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'red slip in' })).true.map(item => { return item.Count })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'R Slip In' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'R Slip In' })).true.map(item => { return item.Count })[0] : 0
                ],
                rSlipOut: [
                    (_.find(eleData, (item => { return item.sfCoating === 'red slip out' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'red slip out' })).true.map(item => { return item.Count })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'R Slip Out' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'R Slip Out' })).true.map(item => { return item.Count })[0] : 0
                ],
                rSlipBoth: [
                    (_.find(eleData, (item => { return item.sfCoating === 'red slip in/out' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'red slip in/out' })).true.map(item => { return item.Count })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'R Slip Both' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'R Slip Both' })).true.map(item => { return item.Count })[0] : 0
                ],
                creamSlipIn: [
                    (_.find(eleData, (item => { return item.sfCoating === 'cream slip in' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'cream slip in' })).true.map(item => { return item.Count })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'Cream Slip In' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'Cream Slip In' })).true.map(item => { return item.Count })[0] : 0
                ],
                creamSlipOut: [
                    (_.find(eleData, (item => { return item.sfCoating === 'cream slip out' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'cream slip out' })).true.map(item => { return item.Count })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'Cream Slip Out' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'Cream Slip Out' })).true.map(item => { return item.Count })[0] : 0
                ],

                untreated: [
                    (_.find(eleData, (item => { return item.sfCoating === 'uncoated' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'uncoated' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'Untreated' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'Untreated' })).true.map(item => { return item.CountProportion })[0] : 0
                ]
            }

            let percents = {
                rSlipIn: [
                    (_.find(eleData, (item => { return item.sfCoating === 'red slip in' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'red slip in' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'R Slip In' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'R Slip In' })).true.map(item => { return item.CountProportion })[0] : 0
                ],
                rSlipOut: [
                    (_.find(eleData, (item => { return item.sfCoating === 'red slip out' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'red slip out' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'R Slip Out' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'R Slip Out' })).true.map(item => { return item.CountProportion })[0] : 0
                ],
                rSlipBoth: [
                    (_.find(eleData, (item => { return item.sfCoating === 'red slip in/out' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'red slip in/out' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'R Slip Both' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'R Slip Both' })).true.map(item => { return item.CountProportion })[0] : 0
                ],
                creamSlipIn: [
                    (_.find(eleData, (item => { return item.sfCoating === 'cream slip in' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'cream slip in' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'Cream Slip In' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'Cream Slip In' })).true.map(item => { return item.CountProportion })[0] : 0
                ],
                creamSlipOut: [
                    (_.find(eleData, (item => { return item.sfCoating === 'cream slip out' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'cream slip out' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'Cream Slip Out' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'Cream Slip Out' })).true.map(item => { return item.CountProportion })[0] : 0
                ],

                untreated: [
                    (_.find(eleData, (item => { return item.sfCoating === 'uncoated' }))) ? _.groupBy(eleData, (item => { return item.sfCoating === 'uncoated' })).true.map(item => { return item.CountProportion })[0] : 0,
                    (_.find(khppData, (item => { return item.surfaceTreatment === 'Untreated' }))) ? _.groupBy(khppData, (item => { return item.surfaceTreatment === 'Untreated' })).true.map(item => { return item.CountProportion })[0] : 0
                ]
            }
            res.send([responseObj, percents]);
        })
    });
}
exports.getKHPPFabricQuery = (req, res, next) => {
    //// console.log(' 1 Body from KHPP Fabric', req.body);


    let sql = `SELECT fabricType,  
                count(*) as 'Count', 
                sum(weight) 'Weight', 
                ( sum(case when weightType = 'g' then (weight/1000) else weight end) / (select sum(case when weightType = 'g' then (weight/1000) else weight end) 
                from egypt.khpptriage) ) as 'weightPercent',
                count(*) / (select count(*) from egypt.khpptriage e   )  as 'CountPercent',
                sum(case when weightType = 'g' then ((weight)/1000) else weight end) as 'kgWeight' 
                FROM egypt.khpptriage t, egypt.khppform f
                where t.formid = f.id 
                and tagNumber in (${convertTagsArrayToSqlIn(req.body)}) group by fabrictype;`;
    //// console.log('Body from KHPP Fabric', sql);

    pool.query(sql, (err, response, fields) => {
        res.send(response);
    })
}
exports.getKHPPWeightBlackenedQuery = (req, res, next) => {

    //// console.log('Blackend Wieight', req.body);
    let intArr, extArr, nullArr, bothArr = [];
    let sql = "select  sherdType, fabricType, " +
        "( sum(case when weightType = 'g' then (weight/1000) else weight end) / (select sum(case when weightType = 'g' then (weight/1000) else weight end)" +
        " from egypt.khppbodysherds) ) as 'weightPercent' , " +
        " sum(case when weightType = 'g' then (weight/1000) else weight end) 'TotalWeightKg' " +
        "FROM egypt.khppbodysherds t, egypt.khppform f" +
        " where t.formid = f.id " +
        " and tagNumber in (" + convertTagsArrayToSqlIn(req.body) + ")  group by sherdType,fabrictype order by 1,2 asc;";
    //// console.log('Body from KHPP Weight Blackened', sql);

    pool.query(sql, (err, response, fields) => {

        grouped = _.groupBy(response, (o) => { return o.sherdType })

        //(grouped);

        for (let i = 0; i < _.keys(grouped).length; i++) {
            let newItem;
            let key = _.keys(grouped)[i];

            //(key);

            let coarse = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Coarse') return o.TotalWeightKg });
            let medium = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Medium') return o.TotalWeightKg });
            let fine = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Fine') return o.TotalWeightKg });
            //(coarse,medium,fine);

            switch (key) {
                case 'Fire Out':
                    extArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire In':
                    intArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire Both':
                    bothArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                default:
                    nullArr = [coarse || 0, medium || 0, fine || 0];
            }




        }
         intArr, extArr, nullArr, bothArr = [];

        let values = {
            exterior: extArr,
            interior: intArr,
            both: bothArr,
            empty: nullArr

        }

        for (let i = 0; i < _.keys(grouped).length; i++) {
            let newItem;
            let key = _.keys(grouped)[i];

            //(key);

            let coarse = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Coarse') return o.weightPercent });
            let medium = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Medium') return o.weightPercent });
            let fine = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Fine') return o.weightPercent });
            //(coarse,medium,fine);

            switch (key) {
                case 'Fire Out':
                    extArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire In':
                    intArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire Both':
                    bothArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                default:
                    nullArr = [coarse || 0, medium || 0, fine || 0];
            }




        }
        let placeholder = {
            exterior: extArr,
            interior: intArr,
            both: bothArr,
            empty: nullArr
        }


        res.send([values, placeholder]);
    })
}
exports.getKHPPCountBlackenedQuery = (req, res, next) => {
    //// console.log('Blackend Count', req.body);

    let intArr, extArr, nullArr, bothArr = [];
    let sql = ` select  sherdType, fabricType, count(*) / (select count(*) from egypt.khppbodysherds e   )  as 'CountPercent' , count(*) 'TotalCount' 
    FROM egypt.khppbodysherds t, egypt.khppform f
    where t.formid = f.id 
    and tagNumber in (${convertTagsArrayToSqlIn(req.body)}) group by sherdType,fabrictype order by 1,2 asc;`;
    //// console.log('Body from KHPP Count Blackened ', sql);

    pool.query(sql, (err, response, fields) => {

        grouped = _.groupBy(response, (o) => { return o.optionType })

        //(grouped);

        for (let i = 0; i < _.keys(grouped).length; i++) {
            let newItem;
            let key = _.keys(grouped)[i];

            //(key);

            let coarse = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Coarse') return o.TotalCount });
            let medium = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Medium') return o.TotalCount });
            let fine = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Fine') return o.TotalCount });
            //(coarse,medium,fine);

            switch (key) {
                case 'Fire Out':
                    extArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire In':
                    intArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire Both':
                    bothArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                default:
                    nullArr = [coarse || 0, medium || 0, fine || 0];
            }




        }

        let values = {
            exterior: extArr,
            interior: intArr,
            both: bothArr,
            empty: nullArr
        }

        for (let i = 0; i < _.keys(grouped).length; i++) {
            let newItem;
            let key = _.keys(grouped)[i];

            //(key);

            let coarse = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Coarse') return o.CountPercent });
            let medium = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Medium') return o.CountPercent });
            let fine = _.sumBy(grouped[key], (o) => { if (o.fabricType === 'Fine') return o.CountPercent });
            //(coarse,medium,fine);

            switch (key) {
                case 'Fire Out':
                    extArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire In':
                    intArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                case 'Fire Both':
                    bothArr = [coarse || 0, medium || 0, fine || 0];
                    break;
                default:
                    nullArr = [coarse || 0, medium || 0, fine || 0];
            }




        }

        let placeholder = {
            exterior: extArr,
            interior: intArr,
            both: bothArr,
            empty: nullArr

        }


        res.send([values, placeholder]);
    })
}


