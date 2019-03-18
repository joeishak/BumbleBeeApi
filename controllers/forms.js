
/**Node Packages and Global Object - Declaration / Instantiation */
let mySql = require('mysql');
let config = require('../jrconfig');


const pool = new mySql.createConnection(config)
pool.connect(err => {
    if (err) console.log(err);
    else console.log('connected to MySQL database:', config.database + 'on host: ' + config.host);
});

exports.writeElephantineForms = (req,res,next) => {
    console.log(req.body.form)
    const form = req.body.form;
    const query = `INSERT INTO egypt.elephantine (locusNum, objectGroupNum, objectNum, numberOfObjects, typeDescription, typeNum, weight, fabric, diameter, preservations, sfCoating, sfTreatment, blackened, incisedDecoration, application, paintedDecoration, comments, photo, processedBy, processedDate, enteredBy, enteredDate, rlNum, sheetNum, lat, lng, room, phase) VALUES ('${form.locusNumber}', '${form.objectGroupNum}', 
            '${form.objectNum}','${form.numberOfObjects}',
            '${form.typeDescription}','${form.typeNum}',
            '${form.weight}','${form.fabric}',
            '${form.diameter}','${form.preservations}',
            '${form.sfCoating}','${form.sfTreatment}',
            '${form.blackened}','${form.incisedDecoration}',
            '${form.application}','${form.paintedDecoration}',
            '${form.comments}','${form.photo}',
            '${form.processedBy}','${form.processedDate}',
            '${form.enteredBy}','${form.enteredDate}',
            '${form.rlNum}','${form.sheetNum}',
            '${form.lat}','${form.lng}',
            '${form.room}','${form.phase}');`;  
    // console.log(query);

     pool.query(query, (err, response, fields) => {
        // Success
        if (response) {
            res.send({status: 201, OkPacket: response});
        }
        if (err) {
        }
    });
}

exports.writeToKHPP = (req, res, next) => {

    console.log(req.body);

    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;

    console.log(sherdsArr);


    const formQuery = `INSERT INTO egypt.khppform (tagNumber,dueDate,processedBy) VALUES ("${form.tagNumber}","${form.dueDate}","${form.processedBy}");`;

    pool.query(formQuery, (err, response, fields) => {
        // Success
        if (response) {
            console.log(response);
            const formId = response.insertId;
            // // TRIAGE
            const triageQueryArr = triageArr.map(triage => {
                return `INSERT INTO egypt.khpptriage (formId, fabricType, bodyOrDiagnostic, rimCount, rimWeight, baseCount, baseWeight, decoratorCount, decoratorWeight, comments) VALUES ("${formId}", "${triage.FabricType}", "${triage.BodyOrDiagnostic}", "${triage.RimCount}", "${triage.RimWeight}", "${triage.BaseCount}","${triage.BaseWeight}", "${triage.DecoratorCount}", "${triage.DecoratorWeight}","${triage.Comments}");`;
            });
            for (let i = 0; i < triageQueryArr.length; i++) {
                const singleTriageQuery = triageQueryArr[i];
                pool.query(singleTriageQuery, (err, response, fields) => { 
                    if (response) { 
                        console.log("HOOOOOYYYY")
                    }
                    if (err) { 
                        console.log("OH NOOOO!!")
                    }
                });
            }

            const sherdsQueryArr = sherdsArr.map(sherds => {
                return  `INSERT INTO egypt.khppbodysherds(formid, fabricType, surfaceTreatment, normal, fireIn, fireOut, fireBoth, rimsTstc, other) VALUES ("${formId}", "${sherds.FabricType}", "${sherds.SurfaceTreatment}", "${sherds.Normal}", "${sherds.FireIn}", "${sherds.FireOut}", "${sherds.FireBoth}", "${sherds.RimsTSTC}", "${sherds.Other}");`;
            });
            for (let j = 0; j < sherdsQueryArr.length; j++) {
                const singleSherdQuery = sherdsQueryArr[j];
                pool.query(singleSherdQuery, (err, response, fields) => { 
                    if (response) {    
                        console.log("YESSS")
                    }
                    if (err) {                 
                        console.log("OHNOOOO")
                    }
                });
            }

            res.send({status: 201, okPacket: response, message: 'INSERTS OKAY'});
            
        }
        if (err) {
            res.send({status: 999, okPacket: response, message: 'ERROR IN INSERT'});
        }
    });

}