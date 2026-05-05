export class QueryBuilder {
    
    constructor() {
        this.statements = [];
    }

    append(fieldName, value) {
        if (value != null && value != undefined)
            this.statements.push(fieldName + " == " + `'${value}'`);
        
        return this;
    }

    toString() {
        return this.statements.join(" AND ");
    }

}