
/**Node Packages and Global Object - Declaration / Instantiation */
let mySql = require('mysql');
let env = require('../config');

var pool = mySql.createPool({
    connectionLimit: 1000,
    host: env.host,
    user: env.user,
    password: env.password,
    database: env.database
});

/**
 * KHPP
 */
exports.getRecordsForExcel = (req, res, next) => {
    const detailedTagArray = convertFilterList(req.body.detailed);
    const basicTagArray = convertFilterList(req.body.basic);
    const detailedRecordsQuery = `SELECT f.tagNumber, f.dueDate, f.processedBy, bs.fabricType, bs.surfaceTreatment, bs.\`count\`, bs.weight, bs.weightType, bs.notes, bs.bodyOrDiagnostic, bs.ware, bs.decoration, bs.diameter, bs.blackening, bs.objectNumber, bs.percentage, bs.hasPhoto, bs.rimsTstc, bs.sheetNumber, bs.typeDescription from egypt.khppform f, egypt.khppbodysherds bs where f.id = bs.formid AND f.tagNumber IN` + ` (${detailedTagArray}) ` +  `;`;
    const basicRecordsQuery = `SELECT f.tagNumber, f.dueDate, f.processedBy, t.fabricType, t.bodyOrDiagnostic, t.\`count\`, t.weight, t.weightType, t.comments, t.notes, t.sherdType from egypt.khppform f, egypt.khpptriage t where f.id = t.formid AND f.tagNumber IN` + ` (${basicTagArray}) ` +  `;`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(detailedRecordsQuery, (err, response, field) => {
     
                if (err) {
                    res.send({error: err});
                } else {
                    pool.query(basicRecordsQuery, (error, resp, field) => {
                        conn.release();
                        console.log('CONNECTION RELEASED getRecordsForExcel');
                        if (error) {
                            res.send({error: err});
                        } else {
                            const responses = {
                                detailed: response,
                                basic: resp
                            };
                            res.send({data: responses});
                        }
                    });
                }
            });  
        }
    });
};
/**
 * KHPP
 */
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
from egypt.elephant;`

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (err, typeNumResponse, field) => {
                if (typeNumResponse) {
                    pool.query(variantQuery, (err, variantResponse, fields) => {
                        conn.release();
                        console.log('CONNECTION RELEASED getTypeNumVariants');
                        let obj = { typeNum: typeNumResponse, variants: variantResponse }
                        res.send(obj);
                    })
                }
            })
        }   
    });
    
    
}
/**
 * KHPP
 */
exports.writeToKHPP = (req, res, next) => {

    // console.log(req.body);
    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;
    
    const formQuery = `INSERT INTO egypt.khppform (tagNumber,dueDate,processedBy) VALUES ("${form.tagNumber}","${form.dueDate}","${form.processedBy}");`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {

            // check to see if the tagNumber is already in the KHPP Form table, if so use that and insert the sherdsArray or triage array
            const getTagNumberQuery = `select id from khppform where tagNumber = "${form.tagNumber}";`

            pool.query(getTagNumberQuery, (_error, _response) => {
                if (_response) {
                    if (_response.length !== 0) {
                        // OLD
                        let oldFormId = _response[0].id;
                        pool.query(formQuery, (err, response, fields) => {
                            // Success
                            if (response) {
                                // console.log(response);
                                let formId = oldFormId
                                // // TRIAGE
                    
                                // Insert on bOdy
                                const triageQueryArr = triageArr.map(triage => {
                                    return `INSERT INTO egypt.khpptriage (formId, fabricType, bodyOrDiagnostic, count, weight, weightType, comments, notes,sherdType) VALUES ("${formId}", 
                                    "${triage.fabricType}", "${triage.bodyOrDiagnostic}", "${triage.count}", "${triage.weight}", "${triage.weightType}", "${triage.comments}", "${triage.notes}", "${triage.sherdType}");`;
                                });
                                for (let i = 0; i < triageQueryArr.length; i++) {
                                    const singleTriageQuery = triageQueryArr[i];
                                    pool.query(singleTriageQuery, (err, response, fields) => {
                                        if (response) {
                                            // console.log("HOOOOOYYYY")
                                        }
                                        if (err) {
                                            // console.log("OH NOOOO!!")
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
                                                // console.log("YESSS")
                                            }
                                            if (err) {
                                                // console.log(err)
                                            }
                                        });
                                    }
                                }
                                conn.release();
                                console.log('CONNECTION RELEASED writeToKHPP');
                    
                                res.send({ status: 201, okPacket: response, message: 'INSERTS OKAY' });
                    
                            }
                            if (err) {
                                res.send({ status: 999, okPacket: response, message: 'ERROR IN INSERT ON FORM QUERY', query: formQuery });
                            }
                        }); 
                    } else {
                        //NEW 
                        pool.query(formQuery, (err, response, fields) => {
                            // Success
                            if (response) {
                                // console.log(response);
                                const formId = response.insertId;
                                // // TRIAGE
                    
                                // Insert on bOdy
                                const triageQueryArr = triageArr.map(triage => {
                                    return `INSERT INTO egypt.khpptriage (formId, fabricType, bodyOrDiagnostic, count, weight, weightType, comments, notes,sherdType) VALUES ("${formId}", 
                                    "${triage.fabricType}", "${triage.bodyOrDiagnostic}", "${triage.count}", "${triage.weight}", "${triage.weightType}", "${triage.comments}", "${triage.notes}", "${triage.sherdType}");`;
                                });
                                for (let i = 0; i < triageQueryArr.length; i++) {
                                    const singleTriageQuery = triageQueryArr[i];
                                    pool.query(singleTriageQuery, (err, response, fields) => {
                                        if (response) {
                                            // console.log("HOOOOOYYYY")
                                        }
                                        if (err) {
                                            // console.log("OH NOOOO!!")
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
                                                // console.log("YESSS")
                                            }
                                            if (err) {
                                                // console.log(err)
                                            }
                                        });
                                    }
                                }
                                conn.release();
                                console.log('CONNECTION RELEASED writeToKHPP');
                    
                                res.send({ status: 201, okPacket: response, message: 'INSERTS OKAY' });
                    
                            }
                            if (err) {
                                res.send({ status: 999, okPacket: response, message: 'ERROR IN INSERT ON FORM QUERY', query: formQuery });
                            }
                        }); 
                    }
                } else {
                    res.send({error: _error})
                }

            });



        }   
    });




}
/**
 * KHPP
 */
exports.readFromKHPP = (req, res, next) => {

    const query = `select f.id, f.tagNumber, f.dueDate, f.processedBy, (select count(*) from egypt.khpptriage t where t.formid = f.id) as 'basicCount' , (select count(*) from egypt.khppbodysherds b where b.formId = f.id ) as 'detailedCount' from egypt.khppform f order by id desc;`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (err, response, fields) => {
                conn.release();
                if (response) {
                    res.send(response);
                }
            });
        }   
    });
};
/**
 * KHPP
 */
exports.editFromKHPP = (req, res, next) => {
    const formId = req.body.formId;
    const type = req.body.type;
    const query = type === 'detailed' ? `SELECT * FROM egypt.khppbodysherds where formId = ${formId};` : `SELECT * FROM egypt.khpptriage where formId = ${formId};`

    
    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (queryError, response, fields) => {
                conn.release();
                if (!queryError) {
                    res.send({formId: formId, records: response});
                }
            });
        }   
    });
}
/**
 * KHPP
 */
exports.updateFromKHPP = (req, res, next) => {
    // console.log(req.body);
    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;
    const type = req.body.type;
    const toDelete = req.body.toDelete;
    const toAdd = req.body.toAdd;

    const updateFormQuery = `UPDATE egypt.khppform SET tagNumber = '${form.tagNumber}', dueDate = '${form.dueDate}', processedBy = '${form.processedBy}'  WHERE (id = '${form.formId}');`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
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

                        conn.release();
        
           
        
                    } 
        
                    if (type === 'basic') {
        
                    }
                }
        
            });
        }   
    });



}
/**
 * KHPP
 */
exports.deleteFromKHPP = (req, res, next) => {

    // Delete from khppbodysherds table
    // Delete from khpptriage table
    // Delete from khppform

    const formId = req.body.formId;

    const deleteAllBodySherdsQuery = `delete from egypt.khppbodysherds where formId = ${formId};`;
    const deleteAllTriageQuery = `delete from egypt.khpptriage where formId = ${formId};`;
    const deleteForm = `delete from egypt.khppform where id = ${formId}`;

    // res.send({sherdsQuery: deleteAllBodySherdsQuery, triageQuery: deleteAllTriageQuery, formQuery: deleteForm});

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(deleteAllBodySherdsQuery, (err, response, fields) => {
                if (response) {
                    // console.log(response);
                    pool.query(deleteAllTriageQuery, (err, response, fields) => {
                        if (response) {
                            //delete form
                            pool.query(deleteForm, (err, response, fields) => {
                                conn.release();
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
    });


}


/**
 * Elephantine
 */
exports.writeToElephantine = (req, res, next) => {

    // console.log(req.body);
    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;
    
    const formQuery = `INSERT INTO egypt.eleform (tagNumber,dueDate, depositDate, processedBy) VALUES ("${form.tagNumber}","${form.dueDate}", "${form.depositDate}", "${form.processedBy}");`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {

            // check to see if the tagNumber is already in the KHPP Form table, if so use that and insert the sherdsArray or triage array
            const getTagNumberQuery = `select id from eleform where tagNumber = "${form.tagNumber}";`

            pool.query(getTagNumberQuery, (_error, _response) => {
                if (_response) {
                    if (_response.length !== 0) {
                        // OLD
                        let oldFormId = _response[0].id;
                        pool.query(formQuery, (err, response, fields) => {
                            // Success
                            if (response) {
                                // console.log(response);
                                let formId = oldFormId
                                // // TRIAGE
                    
                                // Insert on bOdy
                                const triageQueryArr = triageArr.map(triage => {
                                    return `INSERT INTO egypt.eletriage (formId, fabricType, bodyOrDiagnostic, count, weight, weightType, comments, notes,sherdType) VALUES ("${formId}", 
                                    "${triage.fabricType}", "${triage.bodyOrDiagnostic}", "${triage.count}", "${triage.weight}", "${triage.weightType}", "${triage.comments}", "${triage.notes}", "${triage.sherdType}");`;
                                });
                                for (let i = 0; i < triageQueryArr.length; i++) {
                                    const singleTriageQuery = triageQueryArr[i];
                                    pool.query(singleTriageQuery, (err, response, fields) => {
                                        if (response) {
                                            // console.log("HOOOOOYYYY")
                                        }
                                        if (err) {
                                            // console.log("OH NOOOO!!")
                                        }
                                    });
                                }
                    
                                if (sherdsArr.length !== 0) {
                                    const sherdsQueryArr = sherdsArr.map(sherds => {
                                        return `INSERT INTO 
                                        egypt.khppbodysherds(formid, fabricType, surfaceTreatment, count, 
                                            weight, weightType, notes, bodyOrDiagnostic, ware, decoration, 
                                            diameter, blackening, objectNumber, percentage, hasPhoto, rimsTstc, 
                                            sheetNumber, typeDescription, typeFamily, typeNumber, typeVariant, isDrawn, burnishing, sherdDate, houseNumber, roomNumber) 
                                            VALUES ("${formId}", "${sherds.fabricType}", "${sherds.surfaceTreatment}", 
                                            "${sherds.count}", "${sherds.weight}", "${sherds.weightType}", 
                                            "${sherds.notes}", "${sherds.bodyOrDiagnostic}", "${sherds.ware}", 
                                            "${sherds.decoration}", "${sherds.diameter}", "${sherds.blackening}", 
                                            "${sherds.objectNumber}", "${sherds.percentage}", "${sherds.hasPhoto}", 
                                            "${sherds.rimsTstc}", "${sherds.sheetNumber}", "${sherds.typeDescription}", 
                                            "${sherds.typeFamily}", "${sherds.typeNumber}", 
                                            "${sherds.typeVariant}", "${sherds.isDrawn}", "${sherds.burnishing}", "${sherds.sherdDate}, "${sherds.houseNumber}", "${sherds.roomNumber}"");`;
                                    });
                                    for (let j = 0; j < sherdsQueryArr.length; j++) {
                                        const singleSherdQuery = sherdsQueryArr[j];
                                        pool.query(singleSherdQuery, (err, response, fields) => {
                                            if (response) {
                                                // console.log("YESSS")
                                            }
                                            if (err) {
                                                // console.log(err)
                                            }
                                        });
                                    }
                                }
                                conn.release();
                                console.log('CONNECTION RELEASED writeToKHPP');
                    
                                res.send({ status: 201, okPacket: response, message: 'INSERTS OKAY' });
                    
                            }
                            if (err) {
                                res.send({ status: 999, okPacket: response, message: 'ERROR IN INSERT ON FORM QUERY', query: formQuery });
                            }
                        }); 
                    } else {
                        //NEW 
                        pool.query(formQuery, (err, response, fields) => {
                            // Success
                            if (response) {
                                // console.log(response);
                                const formId = response.insertId;
                                // // TRIAGE
                    
                                // Insert on bOdy
                                const triageQueryArr = triageArr.map(triage => {
                                    return `INSERT INTO egypt.eletriage (formId, fabricType, bodyOrDiagnostic, count, weight, weightType, comments, notes,sherdType) VALUES ("${formId}", 
                                    "${triage.fabricType}", "${triage.bodyOrDiagnostic}", "${triage.count}", "${triage.weight}", "${triage.weightType}", "${triage.comments}", "${triage.notes}", "${triage.sherdType}");`;
                                });
                                for (let i = 0; i < triageQueryArr.length; i++) {
                                    const singleTriageQuery = triageQueryArr[i];
                                    pool.query(singleTriageQuery, (err, response, fields) => {
                                        if (response) {
                                            // console.log("HOOOOOYYYY")
                                        }
                                        if (err) {
                                            // console.log("OH NOOOO!!")
                                        }
                                    });
                                }
                    
                                if (sherdsArr.length !== 0) {
                                    const sherdsQueryArr = sherdsArr.map(sherds => {
                                        return `INSERT INTO 
                                        egypt.elebodysherds(formid, fabricType, surfaceTreatment, count, 
                                            weight, weightType, notes, bodyOrDiagnostic, ware, decoration, 
                                            diameter, blackening, objectNumber, percentage, hasPhoto, rimsTstc, 
                                            sheetNumber, typeDescription, typeFamily, typeNumber, typeVariant, isDrawn, burnishing, sherdDate, houseNumber, roomNumber) 
                                            VALUES ("${formId}", "${sherds.fabricType}", "${sherds.surfaceTreatment}", 
                                            "${sherds.count}", "${sherds.weight}", "${sherds.weightType}", 
                                            "${sherds.notes}", "${sherds.bodyOrDiagnostic}", "${sherds.ware}", 
                                            "${sherds.decoration}", "${sherds.diameter}", "${sherds.blackening}", 
                                            "${sherds.objectNumber}", "${sherds.percentage}", "${sherds.hasPhoto}", 
                                            "${sherds.rimsTstc}", "${sherds.sheetNumber}", "${sherds.typeDescription}", 
                                            "${sherds.typeFamily}", "${sherds.typeNumber}", 
                                            "${sherds.typeVariant}", "${sherds.isDrawn}", "${sherds.burnishing}", "${sherds.sherdDate}", "${sherds.houseNumber}", "${sherds.roomNumber}");`;
                                    });
                                    for (let j = 0; j < sherdsQueryArr.length; j++) {
                                        const singleSherdQuery = sherdsQueryArr[j];
                                        pool.query(singleSherdQuery, (err, response, fields) => {
                                            if (response) {
                                                // console.log("YESSS")
                                            }
                                            if (err) {
                                                // console.log(err)
                                            }
                                        });
                                    }
                                }
                                conn.release();
                                console.log('CONNECTION RELEASED writeToKHPP');
                    
                                res.send({ status: 201, okPacket: response, message: 'INSERTS OKAY' });
                    
                            }
                            if (err) {
                                res.send({ status: 999, okPacket: response, message: 'ERROR IN INSERT ON FORM QUERY', query: formQuery });
                            }
                        }); 
                    }
                } else {
                    res.send({error: _error})
                }

            });



        }   
    });




}
/**
 * Elephantine
 */
exports.readFromElephantine = (req, res, next) => {

    const query = `select f.id, f.tagNumber, f.dueDate, f.processedBy, (select count(*) from egypt.eletriage t where t.formid = f.id) as 'basicCount' , (select count(*) from egypt.elebodysherds b where b.formId = f.id ) as 'detailedCount' from egypt.eleform f order by id desc;`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (err, response, fields) => {
                conn.release();
                if (response) {
                    res.send(response);
                }
            });
        }   
    });
};
/**
 * Elephantine
 */
exports.editFromElephantine = (req, res, next) => {
    const formId = req.body.formId;
    const type = req.body.type;
    const query = type === 'detailed' ? `SELECT * FROM egypt.elebodysherds where formId = ${formId};` : `SELECT * FROM egypt.eletriage where formId = ${formId};`

    
    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(query, (queryError, response, fields) => {
                conn.release();
                if (!queryError) {
                    res.send({formId: formId, records: response});
                }
            });
        }   
    });
}
/**
 * Elephantine
 */
exports.updateFromElephantine = (req, res, next) => {
    // console.log(req.body);
    const form = req.body.form;
    const sherdsArr = req.body.sherds;
    const triageArr = req.body.triage;
    const type = req.body.type;
    const toDelete = req.body.toDelete;
    const toAdd = req.body.toAdd;

    const updateFormQuery = `UPDATE egypt.eleform SET tagNumber = '${form.tagNumber}', dueDate = '${form.dueDate}', processedBy = '${form.processedBy}', sherdDate = '${form.sherdDate}', houseNumber = '${form.houseNumber}', roomNumber = '${form.roomNumber}'  WHERE (id = '${form.formId}');`;

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
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
                                    return `DELETE from egypt.elebodysherds WHERE (id = '${ele.id}');`;
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
                                    return `UPDATE egypt.elebodysherds SET fabricType = '${ele.fabricType}', surfaceTreatment = '${ele.surfaceTreatment}', count = '${ele.count}', weight = '${ele.weight}', weightType = '${ele.weightType}', notes = '${ele.notes}', bodyOrDiagnostic = '${ele.bodyOrDiagnostic}', ware = '${ele.ware}', decoration = '${ele.decoration}', diameter = '${ele.diameter}', blackening = '${ele.blackening}', objectNumber = '${ele.objectNumber}', percentage = '${ele.percentage}', hasPhoto = '${ele.hasPhoto}', rimsTstc =  '${ele.rimsTstc}', sheetNumber = '${ele.sheetNumber}', typeDescription = '${ele.typeDescription}', typeFamily = '${ele.typeFamily}', typeNumber = '${ele.typeNumber}', typeVariant = '${ele.typeVariant}', isDrawn = '${ele.isDrawn}', burnishing = '${ele.burnishing}', sherdDate = '${ele.sherdDate}', houseNumber = '${ele.houseNumber}', roomNumber = '${ele.roomNumber}' WHERE (id = '${ele.id}');`;
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
                                egypt.elebodysherds(formid, fabricType, surfaceTreatment, count, 
                                    weight, weightType, notes, bodyOrDiagnostic, ware, decoration, 
                                    diameter, blackening, objectNumber, percentage, hasPhoto, rimsTstc, 
                                    sheetNumber, typeDescription, typeFamily, typeNumber, typeVariant, isDrawn, burnishing, sherdDate, houseNumber, roomNumber) 
                                    VALUES ("${form.formId}", "${sherds.fabricType}", "${sherds.surfaceTreatment}", 
                                    "${sherds.count}", "${sherds.weight}", "${sherds.weightType}", 
                                    "${sherds.notes}", "${sherds.bodyOrDiagnostic}", "${sherds.ware}", 
                                    "${sherds.decoration}", "${sherds.diameter}", "${sherds.blackening}", 
                                    "${sherds.objectNumber}", "${sherds.percentage}", "${sherds.hasPhoto}", 
                                    "${sherds.rimsTstc}", "${sherds.sheetNumber}", "${sherds.typeDescription}", 
                                    "${sherds.typeFamily}", "${sherds.typeNumber}", 
                                    "${sherds.typeVariant}", "${sherds.isDrawn}", "${sherds.burnishing}", "${sherds.sherdDate}", "${sherds.houseNumber}", "${sherds.roomNumber}");`;
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

                        conn.release();
        
           
        
                    } 
        
                    if (type === 'basic') {
        
                    }
                }
        
            });
        }   
    });



}
/**
 * Elephantine
 */
exports.deleteFromElephantine = (req, res, next) => {

    // Delete from khppbodysherds table
    // Delete from khpptriage table
    // Delete from khppform

    const formId = req.body.formId;

    const deleteAllBodySherdsQuery = `delete from egypt.elebodysherds where formId = ${formId};`;
    const deleteAllTriageQuery = `delete from egypt.eletriage where formId = ${formId};`;
    const deleteForm = `delete from egypt.eleform where id = ${formId}`;

    // res.send({sherdsQuery: deleteAllBodySherdsQuery, triageQuery: deleteAllTriageQuery, formQuery: deleteForm});

    pool.getConnection((connectionError, conn) => {
        if (connectionError) {
            if (connectionError instanceof Errors.NotFound) {
                return res.status(HttpStatus.NOT_FOUND).send({message: connectionError.message}); 
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
        } else {
            pool.query(deleteAllBodySherdsQuery, (err, response, fields) => {
                if (response) {
                    // console.log(response);
                    pool.query(deleteAllTriageQuery, (err, response, fields) => {
                        if (response) {
                            //delete form
                            pool.query(deleteForm, (err, response, fields) => {
                                conn.release();
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
    });


}



/**
 * Local utilities function
 */
function convertFilterList(arrayList) {
    return "'" + arrayList.join("\', \'") + "' ";
}