
/**Node Packages and Global Object - Declaration / Instantiation */
let mySql = require('mysql');
let config = require('../jrconfig');


const pool = new mySql.createConnection(config)
pool.connect(err => {
    if (err) console.log(err);
    else console.log('connected to MySQL database:', config.database + 'on host: ' + config.host);
});

exports.getTypeNumVariants = (req, res, next) => {
    const query = `select distinct case 
	when typenum = 'BS' then 'BS'
    when typenum = 'BSD' then 'BSD'
    when typenum = 'null' then 'null'
    when typenum = 'UNTY' then 'UNTY'
    when typenum != 'BS' and typenum != 'UNTY'  and typenum !='BSD' and typenum!= 'null' and   right(typenum,1)  REGEXP "[a-z, !]"  then left(typenum, length(typeNum)-1)
        when typenum != 'BS' and typenum != 'UNTY' and typenum !='BSD' and typenum!= 'null' and   right(typenum,1)  REGEXP "[0-9]"  then typenum
    end as 'typenum'
    
     from egypt.elephant order by typenum`;
    const variantQuery = ` select distinct     
     case when  typenum != 'BS' and typenum != 'UNTY'  and typenum !='BSD' and typenum!= 'null' and   right(typenum,1)  REGEXP "[a-z, !]"  then right(typenum, 1) end as 'typeVariant'
from egypt.elephant;
`

    pool.query(query, (err, typeNumResponse, field) => {
        if (typeNumResponse) {
            pool.query(variantQuery, (err, variantResponse, fields) => {
                let obj = { typeNum: typeNumResponse, variants: variantResponse }
                res.send(obj);
            })
        }
    })
}

exports.writeElephantForms = (req, res, next) => {
    console.log(req.body.form)
    const form = req.body.form;
    const query = `INSERT INTO egypt.elephant (locusNum, objectGroupNum, objectNum, 
        numberOfObjects, typeDescription, typeNum,variants, weight, fabric, ware, fabricVariant, diameter, preservations, 
        sfCoating, sfTreatment, blackened, incisedDecoration, application, paintedDecoration,
         comments,  processedBy, processedDate, enteredBy, enteredDate, rlNum, sheetNum
         ) VALUES ('${form.locusNumber}', '${form.objectGroupNum}', 
         '${form.objectNum}','${form.numberOfObjects}','${form.typeDescription}','${form.typeNum}','${form.typeVariant}',
            '${form.weight}','${form.fabric}','${form.ware}','${form.fabricVariant}',
            '${form.diameter}','${form.preservations}',
            '${form.sfCoating}','${form.sfTreatment}',
            '${form.blackened}','${form.incisedDecoration}',
            '${form.application}','${form.paintedDecoration}',
            '${form.comments}',
            '${form.processedBy}','${form.processedDate}',
            '${form.enteredBy}','${form.enteredDate}',
            '${form.rlNum}','${form.sheetNum}'
          );`;
    console.log(query);

    pool.query(query, (err, response, fields) => {
        // Success
        if (response) {
            res.send({ status: 201, OkPacket: response });
        }
        if (err) {
            console.log(err);
        }
    });
}

exports.writeToKHPP = (req, res, next) => {

    console.log(req.body);
    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;


    console.log(triageArr);


    const formQuery = `INSERT INTO egypt.khppform (tagNumber,dueDate,processedBy) VALUES ("${form.tagNumber}","${form.dueDate}","${form.processedBy}");`;

    pool.query(formQuery, (err, response, fields) => {
        // Success
        if (response) {
            console.log(response);
            const formId = response.insertId;
            // // TRIAGE

            // Insert on bOdy
            const triageQueryArr = triageArr.map(triage => {
                return `INSERT INTO egypt.khpptriage (formId, fabricType, bodyOrDiagnostic, count, weight, weightType, comments, notes,sherdType) VALUES ("${formId}", "${triage.fabricType}", "${triage.bodyOrDiagnostic}", "${triage.count}", "${triage.weight}", "${triage.weightType}", "${triage.comments}", "${triage.notes}", "${triage.sherdType}");`;
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

            if (sherdsArr.length !== 0) {
                const sherdsQueryArr = sherdsArr.map(sherds => {
                    return `INSERT INTO 
                    egypt.khppbodysherds(formid, fabricType, surfaceTreatment, count, 
                        weight, weightType, notes, bodyOrDiagnostic, ware, decoration, 
                        diameter, blackening, objectNumber, percentage, hasPhoto, rimsTstc, 
                        sheetNumber, typeDescription, typeFamily, typeNumber, typeVariant, isDrawn, burnishing) 
                        VALUES ("${formId}", "${sherds.fabricType}", "${sherds.surfaceTreatment}", 
                        "${sherds.count}", "${sherds.weight}", "${sherds.weightType}", 
                        "${sherds.notes}", "${sherds.bodyOrDiagnostic}", "${sherds.ware}", 
                        "${sherds.decoration}", "${sherds.diameter}", "${sherds.blackening}", 
                        "${sherds.objectNumber}", "${sherds.percentage}", "${sherds.hasPhoto}", 
                        "${sherds.rimsTstc}", "${sherds.sheetNumber}", "${sherds.typeDescription}", 
                        "${sherds.typeFamily}", "${sherds.typeNumber}", 
                        "${sherds.typeVariant}", "${sherds.isDrawn}", "${sherds.burnishing}");`;
                });
                for (let j = 0; j < sherdsQueryArr.length; j++) {
                    const singleSherdQuery = sherdsQueryArr[j];
                    pool.query(singleSherdQuery, (err, response, fields) => {
                        if (response) {
                            console.log("YESSS")
                        }
                        if (err) {
                            console.log(err)
                        }
                    });
                }
            }


            res.send({ status: 201, okPacket: response, message: 'INSERTS OKAY' });

        }
        if (err) {
            res.send({ status: 999, okPacket: response, message: 'ERROR IN INSERT ON FORM QUERY', query: formQuery });
        }
    });

}

exports.readFromKHPP = (req, res, next) => {

    const query = `select id, tagNumber, dueDate, processedBy, (select count(*) from egypt.khpptriage t where t.formid = f.id) as 'basicCount' , (select count(*) from egypt.khppbodysherds b where b.formId = f.id ) as 'detailedCount' from egypt.khppform f order by id desc;`;

    pool.query(query, (err, response, fields) => {
        if (response) {
            res.status(200).send(response);
        } else if (err) {
            res.status(999).send(response);
        }
    });

}

exports.editFromKHPP = (req, res, next) => {
    const formId = req.body.formId;
    const type = req.body.type;


    const query = type === 'detailed' ? `SELECT * FROM egypt.khppbodysherds where formId = ${formId};` : `SELECT * FROM egypt.khpptriage where formId = ${formId};`

    pool.query(query, (err, response, fields) => {
        if (response) {
            console.log(response);
            res.send({formId: formId, records: response});
        } else if (err) {
            res.send({ status: 999, okPacket: response, message: 'ERROR IN DELETE' });
        }
    });
}

exports.updateFromKHPP = (req, res, next) => {
    // console.log(req.body);
    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;
    const type = req.body.type;
    const toDelete = req.body.toDelete;
    const toAdd = req.body.toAdd;

    const updateFormQuery = `UPDATE egypt.khppform SET tagNumber = '${form.tagNumber}', dueDate = '${form.dueDate}', processedBy = '${form.processedBy}'  WHERE (id = '${form.formId}');`;


    pool.query(updateFormQuery, (err, response, fields) => {

        if (err) {
            /**
             * Throw Error
             */
        } else {


            // Check Type if Detailed or Basic
            if (type === 'detailed') {

                // Delete Detailed Records
                if (toDelete.length !== 0 || toDelete !== null) {
                    const deleteQueryArr = toDelete.map(ele => {
                        if (ele.id == null) {
                            return '';
                        } else {
                            return `DELETE from egypt.khppbodysherds WHERE (id = '${ele.id}');`;
                        }

                    });

                    for (let i = 0; i < deleteQueryArr.length; i++) {
                        const eachRecordToDelete = deleteQueryArr[i];

                        if (eachRecordToDelete !== '') {
                            pool.query(eachRecordToDelete, (err, response, fields) => {
                                if (err) {
                                    // Error in deleting
                                } else {
                                    // Success in deleting
                                }
                            });
                        }
                    }
                }

                // Update, check to see if the detailed shers array is empty
                if (sherdsArr.length !== 0 || sherdsArr !== null) {
                    const sherdUpdateQueryArr = sherdsArr.map(ele => {
                        if (ele.id == null) {
                            return '';
                        } else {
                            return `UPDATE egypt.khppbodysherds SET fabricType = '${ele.fabricType}', surfaceTreatment = '${ele.surfaceTreatment}', count = '${ele.count}', weight = '${ele.weight}', weightType = '${ele.weightType}', notes = '${ele.notes}', bodyOrDiagnostic = '${ele.bodyOrDiagnostic}', ware = '${ele.ware}', decoration = '${ele.decoration}', diameter = '${ele.diameter}', blackening = '${ele.blackening}', objectNumber = '${ele.objectNumber}', percentage = '${ele.percentage}', hasPhoto = '${ele.hasPhoto}', rimsTstc =  '${ele.rimsTstc}', sheetNumber = '${ele.sheetNumber}', typeDescription = '${ele.typeDescription}', typeFamily = '${ele.typeFamily}', typeNumber = '${ele.typeNumber}', typeVariant = '${ele.typeVariant}', isDrawn = '${ele.isDrawn}', burnishing = '${ele.burnishing}' WHERE (id = '${ele.id}');`;
                        }
                    });

                    for (let k = 0; k < sherdUpdateQueryArr.length; k++) {
                        const eachUpdate = sherdUpdateQueryArr[k];
                        // console.log(eachUpdate);
                        if (eachUpdate !== '') {
                            pool.query(eachUpdate, (err, response, fields) => {
                                if (err) {
                                    // error
                                } else {
                                    // success;
                                }
                            });
                        }
                    }

                    res.send({response: sherdUpdateQueryArr});
                }

                // Insert
                if (toAdd !== 0 || toAdd !== null) {
                    const sherdsQueryArr = toAdd.map(sherds => {
                        return `INSERT INTO 
                        egypt.khppbodysherds(formid, fabricType, surfaceTreatment, count, 
                            weight, weightType, notes, bodyOrDiagnostic, ware, decoration, 
                            diameter, blackening, objectNumber, percentage, hasPhoto, rimsTstc, 
                            sheetNumber, typeDescription, typeFamily, typeNumber, typeVariant, isDrawn, burnishing) 
                            VALUES ("${form.formId}", "${sherds.fabricType}", "${sherds.surfaceTreatment}", 
                            "${sherds.count}", "${sherds.weight}", "${sherds.weightType}", 
                            "${sherds.notes}", "${sherds.bodyOrDiagnostic}", "${sherds.ware}", 
                            "${sherds.decoration}", "${sherds.diameter}", "${sherds.blackening}", 
                            "${sherds.objectNumber}", "${sherds.percentage}", "${sherds.hasPhoto}", 
                            "${sherds.rimsTstc}", "${sherds.sheetNumber}", "${sherds.typeDescription}", 
                            "${sherds.typeFamily}", "${sherds.typeNumber}", 
                            "${sherds.typeVariant}", "${sherds.isDrawn}", "${sherds.burnishing}");`;
                    });

                    for (let w = 0; w < sherdsQueryArr.length; w++) {
                        const element = sherdsQueryArr[w];

                        pool.query(element, (err, res, fields) => {
                            if (err) {
                                // error
                            } else {
                                // success
                            }
                        });
                        
                    }
                }

   

            } 

            if (type === 'basic') {

            }
        }

    });

}

exports.deleteFromKHPP = (req, res, next) => {

    // Delete from khppbodysherds table
    // Delete from khpptriage table
    // Delete from khppform

    const formId = req.body.formId;

    const deleteAllBodySherdsQuery = `delete from egypt.khppbodysherds where formId = ${formId};`;
    const deleteAllTriageQuery = `delete from egypt.khpptriage where formId = ${formId};`;
    const deleteForm = `delete from egypt.khppform where id = ${formId}`;

    // res.send({sherdsQuery: deleteAllBodySherdsQuery, triageQuery: deleteAllTriageQuery, formQuery: deleteForm});

    pool.query(deleteAllBodySherdsQuery, (err, response, fields) => {
        if (response) {
            console.log(response);
            pool.query(deleteAllTriageQuery, (err, response, fields) => {
                if (response) {
                    //delete form
                    pool.query(deleteForm, (err, response, fields) => {
                        if (response) {
                            res.send({ status: 201, okPacket: response, message: 'DELETE OKAY' });
                        } else if (err) {
                            res.send({ status: 999, okPacket: response, message: 'ERROR IN DELETE' });
                        }
                    });
                } else if (err) {
                    res.send({ status: 999, okPacket: response, message: 'ERROR IN DELETE' });
                }
            });
        } else if (err) {
             res.send({ status: 999, okPacket: response, message: 'ERROR IN DELETE' });
        }
    });
}