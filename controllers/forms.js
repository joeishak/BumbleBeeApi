
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

        // console.log('ERROR', err);
        // console.log('RESPONSE', response);
    });
}