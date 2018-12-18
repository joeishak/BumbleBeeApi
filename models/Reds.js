module.exports = class Reds {
    constructor(obj) {
        this.unitNum    = (obj["Unit #"] ==="")? null:obj["Unit #"] ,
        this.locusNum   = (obj["Locus #"] ==="")? null: obj["Locus #"],
        this.objectNum  = (obj["Object #"] ==="")? null: obj["Object #"],
        this.bodyCoarseCount = (obj["Body Coarse Count"] ==="")? null: obj["Body Coarse Count"],
        this.bodyCoarseWeight = (obj["Body Coarse Weight"] ==="")? null: obj["Body Coarse Weight"],
        this.bodyMediumCount = (obj["Body Meidum Conunt"] ==="")? null:obj["Body Medium Count"],
        this.bodyMediumWeight  =(obj["Body Medium Weight"] ==="")? null:obj["Body Medium Weight"], 
        this.bodyFineCount = (obj["Body Fine Count"] ==="")? null:obj["Body Fine Count"],
        this.bodyFineWeight= (obj["Body Fine Weight"] ==="")? null:obj["Body Fine Weight"],
        this.bodyMarlCount = (obj["Body Marl Count"] ==="")? null:obj["Body Marl Count"],
        this.bodyMarlWeight= (obj["Body Marl Weight"] ==="")? null:obj["Body Marl Weight"],
        this.bodyTotalCount= (obj["Body Total Count"] ==="")? null:obj["Body Total Count"],
        this.bodyTotalWeight= (obj["Body Total Weight"] ==="")? null:obj["Body Total Weight"],
        this.diagnosticCoarseCount = (obj["Diagnostic Coarse Count"] ==="")? null:obj["Diagnostic Coarse Count"], 
        this.diagnosticCoarseWeight = (obj["Diaggnostic Coarse Weight"] ==="")? null:obj["Diagnostic Coarse Weight"],
        this.diagnosticMediumCount =(obj["Diaggnostic Medium Count"] ==="")? null:obj["Diagnostic Medium Count"] ,
        this.diagnosticMediumWeight =(obj["Diaggnostic Medium Weight"] ==="")? null:obj["Diagnostic Medium Weight"] ,
        this.diagnosticFineCount =(obj["Diaggnostic Fine Count"] ==="")? null:obj["Diagnostic Fine Count"] ,
        this.diagnosticFineWeight = (obj["Diaggnostic Fine Weight"] ==="")? null:obj["Diagnostic Fine Weight"],
        this.diagnosticMarlCount = (obj["Diaggnostic Marl Count"] ==="")? null:obj["Diagnostic Marl Count"],
        this.diagnosticMarlWeight= (obj["Diaggnostic Marl Weight"] ==="")? null:obj["Diagnostic Marl Weight"],
        this.diagnosticTotalCount =(obj["Diaggnostic Total Count"] ==="")? null:obj["Diagnostic Total Count"] ,
        this.diagnosticTotalWeight = (obj["Diaggnostic Total Weight"] ==="")? null:obj["Diagnostic Total Weight"],
        this.dateOfEntry = (obj["Date"] ==="")? null:obj["Date"],
        this.specialNotes = (obj["Special Notes"] ==="")? null:obj["Special Notes"]
    }
    insertIntoDatabase(execute){
        let sql = `Insert  into reds (unitNum, locusNum, objectNum, `+
            `bodyCoarseCount, bodyCoarseWeight,bodyMediumCount, bodyMediumWeight, bodyFineCount, bodyFineWeight, bodyMarlCount,`+
            `bodyMarlWeight, bodyTotalCount, bodyTotalWeight, diagnosticCoarseCount, diagnosticCoarseWeight, diagnosticMediumCount, diagnosticMediumWeight,diagnosticFineCount,diagnosticFineWeight,diagnosticMarlCount,` +
            `diagnosticMarlWeight,diagnosticTotalCount, diagnosticTotalWeight,dateOfEntry,specialNotes) Values(`+
            `'${this.unitNum}', '${this.locusNum}', '${this.objectNum}','${this.bodyCoarseCount}',`+
            `'${this.bodyCoarseWeight}','${this.bodyMediumCount}','${this.bodyMediumWeight}','${this.bodyFineCount}','${this.bodyFineWeight}','${this.bodyMarlCount}','${this.bodyMarlWeight}','${this.bodyTotalCount}',`+
            `'${this.bodyTotalWeight}','${this.diagnosticCoarseCount}','${this.diagnosticCoarseWeight}','${this.diagnosticMediumCount}','${this.diagnosticMediumWeight}','${this.diagnosticFineCount}','${this.diagnosticFineWeight}','${this.diagnosticMarlCount}', `+
            `'${this.diagnosticMarlWeight}','${this.diagnosticTotalCount}','${this.diagnosticTotalWeight}','${this.dateOfEntry}', '${this.specialNotes}');`;
        if(execute){
            return sql;
        }
        else{
        //    return  executeQuery(sql);
        }

    }
}