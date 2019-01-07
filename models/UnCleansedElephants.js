module.exports = class UnCleansedElephants {
    constructor(obj){
        // console.log(obj);
        this.locusNum           = (obj["locus no"] ==="")? null:obj["locus no"] ,
		this.objectGroupNum     = (obj["object group no"]==="")? null:obj["object group no"] ,
		this.objectNum          = (obj["object no"]==="")? null:obj["object no"] ,
		this.numberOfObjects    = (obj["number of objects"]==="")? null:obj["number of objects"] ,
        this.typeDescription    = (obj["type description"]==="")? null:obj["type description"] ,
		this.typeNum            = (obj["type no"]==="")? null:obj["type no"] ,
        this.weight             = (obj["Weight"]==="")? null:obj["Weight"] ,
		this.fabric             = (obj["fabric"]==="")? null:obj["fabric"] ,
		this.diameter           = (obj["diameter"]==="")? null:obj["diameter"] ,
		this.preservations      = (obj["preservation"]==="")? null:obj["preservation"] ,
		this.sfCoating          = (obj["sf coating"]==="")? null:obj["sf coating"] ,
		this.sfTreatment        = (obj["sf treatment"]==="")? null:obj["sf treatment"] ,
		this.blackened          = (obj["blackened"]==="")? null:obj["blackened"] ,
		this.incisedDecoration  = (obj["incised decoration"]==="")? null:obj["incised decoration"] ,
		this.application        = (obj["application"]==="")? null:obj["application"] ,
		this.paintedDecoration  = (obj["painted decoration"]==="")? null:obj["painted decoration"] ,
		this.comments           = (obj["comments"]==="")? null:obj["comments"] ,
        this.photo              = (obj["photo"]==="")? null:obj["photo"] ,
        this.processedBy        = (obj["processed by"]==="")? null:obj["processed by"] ,
        this.processedDate      = (obj["processed date"]==="")? null:obj["processed date"] ,
        this.enteredBy          = (obj["entered by"]==="")? null:obj["entered by"] ,
        this.enteredDate        = (obj["entered date"]==="")? null:obj["entered date"] ,
        this.rlNum              = (obj["RL no."]==="")? null:obj["RL no."] ,
        this.sheetNum           = (obj["Sheet no."] ==="")? null:obj["Sheet no."]
    }

    insertIntoDatabase(execute){
        let sql = `Insert  into elephant (locusNum, objectGroupNum, objectNum, `+
            `numberOfObjects, typeDescription,typeNum, weight, fabric, diameter, preservations,`+
            `sfCoating, sfTreatment, blackened, incisedDecoration, application, paintedDecoration, comments,photo,processedBy,processedDate,` +
            `enteredBy,enteredDate, rlNum,sheetNum) Values(`+
            `'${this.locusNum}', '${this.objectGroupNum}', '${this.objectNum}','${this.numberOfObjects}',`+
            `'${this.typeDescription}','${this.typeNum}','${this.weight}','${this.fabric}','${this.diameter}','${this.preservations}','${this.sfCoating}','${this.sfTreatment}',`+
            `'${this.blackened}','${this.incisedDecoration}','${this.application}','${this.paintedDecoration}','${this.comments}','${this.photo}','${this.processedBy}','${this.processedDate}', `+
            `'${this.enteredBy}','${this.enteredDate}','${this.rlNum}','${this.sheetNum}');`;
        if(execute){
            return sql;
        }
        else{
        //    return  executeQuery(sql);
        }

    }
}