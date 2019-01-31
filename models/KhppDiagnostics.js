module.exports = class KhppDiagnostics {
    constructor(obj) {
        {
            this.vessel = obj["vesselIdentifier"] === "" ? null :  obj["vesselIdentifier"];
            this.fabric = obj["fabric"]=== "" ? null :  obj["fabric"];
            this.surfaceTreatment = obj["surfaceTreatment"]=== "" ? null :  obj["surfaceTreatment"];
            this.blackened = obj["fire blackening"]=== "" ? null :  obj["fire blackening"];
            this.notes = obj["other notes"] === "" ? null :  obj["other notes"];
            this.preserved = obj["preserved"] === "" ? null :  obj["preserved"];
            this.diameter = obj["diameter"]=== "" ? null :  obj["diameter"];
            this.sheet = obj["sheet"]=== "" ? null :  obj["sheet"];
          }
    }
    insertIntoDatabase(statementIsToBeExecuted){
        let sql = `Insert  into egypt.khppdiagnostics (vesselid,fabric,surfaceTreatment,blackened,notes,preserved,diameter,sheet) Values(`+
            `'${this.vessel}', '${this.fabric}', '${this.surfaceTreatment}','${this.blackened}',`+
            `'${this.notes}',${this.preserved},${this.diameter},${this.sheet});`;
        if(statementIsToBeExecuted){
            return sql;
        }
        else{
        //    return  executeQuery(sql);
        }

    }
}