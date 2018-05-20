"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class BaseRepository {
    constructor(schemaModel) {
        this.model = schemaModel;
    }
    validateParam(param) {
        if (!param)
            param = {};
        if (!param.query)
            param.query = {};
        if (param.populate && typeof param.populate !== 'object')
            param.populate = undefined;
        return param;
    }
    async find(param, order, page, limit) {
        param = this.validateParam(param);
        let query = this.model.find(param.query);
        if (param.select)
            query = query.select(param.select);
        if (param.populate)
            query = query.populate(param.populate);
        let pagination = this.paging(page, limit);
        if (order)
            query = query.sort(order);
        query = query.skip(pagination.skip).limit(pagination.limit);
        return (await query.exec().then(docs => docs.map(doc => doc.toJSON())));
    }
    async findAll(param, order) {
        param = this.validateParam(param);
        let query = this.model.find(param.query);
        if (param.select)
            query = query.select(param.select);
        if (param.populate)
            query = query.populate(param.populate);
        if (order)
            query = query.sort(order);
        return (await query.exec().then(docs => docs.map(doc => doc.toJSON())));
    }
    async findOne(param) {
        param = this.validateParam(param);
        let query = this.model.findOne(param.query);
        if (param.select)
            query = query.select(param.select);
        if (param.populate)
            query = query.populate(param.populate);
        return (await query.exec().then(doc => doc ? doc.toJSON() : undefined));
    }
    async count(param) {
        param = this.validateParam(param);
        return await this.model.find(param.query).count();
    }
    async get(_id, populate) {
        if (populate && typeof populate !== 'object')
            populate = undefined;
        let query = this.model.findById(_id);
        if (populate)
            query = query.populate(populate);
        return (await query.exec().then(doc => doc ? doc.toJSON() : undefined));
    }
    async aggregate(query) {
        return await this.model.aggregate(query).exec();
    }
    async create(data) {
        return (await this.model.create(data).then(doc => doc ? doc.toJSON() : undefined));
    }
    async createMultiple(data) {
        return (await this.model.create(data).then(docs => docs.map(doc => doc.toJSON())));
    }
    async createOrUpdate(query, data) {
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };
        return (await this.model.findOneAndUpdate(query, data, options).exec().then(doc => doc ? doc.toJSON() : undefined));
    }
    async update(_id, data) {
        let result = await this.model.update({ _id: this.toObjectId(_id) }, data).exec();
        return result && result.ok > 0;
    }
    async findOneAndUpdate(query, data) {
        return (await this.model.findOneAndUpdate(query, data, { new: true }).exec().then(doc => doc ? doc.toJSON() : undefined));
    }
    async updateDataByFields(_id, data, parentField) {
        if (_id && data) {
            for (let field in data) {
                if (data.hasOwnProperty(field)) {
                    let prop = parentField ? parentField + '.' + field : field;
                    let dataUpdate = {};
                    dataUpdate[prop] = data[field];
                    await this.update(_id, dataUpdate);
                }
            }
        }
    }
    async delete(_id, isRealDelete = false) {
        if (!isRealDelete) {
            let result = await this.model.update({ _id: this.toObjectId(_id) }, { deletedAt: new Date() }).exec();
            return result && result.ok > 0;
        }
        await this.model.remove({ _id: this.toObjectId(_id) }).exec();
        return true;
    }
    toObjectId(_id) {
        return mongoose.Types.ObjectId.createFromHexString(_id && _id.toString());
    }
    paging(page, limit) {
        if (!page || isNaN(page))
            page = 1;
        if (!limit || isNaN(limit))
            limit = 10;
        return {
            limit,
            skip: (page - 1) * limit
        };
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map