const mongodb = require("../mongodb");
const _ = require("lodash");

const Collection = {
    Judge: "Judge",
    Country: "Country"
}

class DAO {
    constructor(collection) {
        if (collection == Collection.Judge) {
            this.collection = mongodb.judges;
            this.filter = "name";
        }
        else if (collection == Collection.Country) {
            this.countries = mongodb.countries;
            this.filter = "code";
        }
    }

    getFilter(id) {
        return { [this.filter]: id };
    }

    getAll() {
        return this.collection.find().toArray( (err, results) => {
            if (err) throw err;
            return results;
        });
    }

    getSpecific(id) {
        const filter = this.getFilter(id);

        return this.collection.findOne(filter, (err, result) => {
            if (err) throw err;
            return result;
        })
        
    }

    async insert(data, paramsToOmit = null) {
        if (paramsToOmit != null) data = _.omit(data, paramsToOmit);

        const ack = await this.collection.insertOne(data);
        return ack.acknowledged;
    }

    async update(id, updatedData) {
        const filter = this.getFilter(id);
        const updatedDoc = { $set: updatedData };

        const ack = await this.collection.updateOne(filter, updatedDoc);
        return ack.acknowledged;
    }

    async delete(id) {
        const filter = this.getFilter(id);

        const ack = await this.collection.deleteOne(filter);
        return ack.acknowledged;
    }
}

// Change the return value. Check the second parameter and return true/false.

module.exports = {
    DAO,
    Collection
};