/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import IRead from '../interfaces/IRead';
import IWrite from '../interfaces/IWrite';
declare class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
    protected model: mongoose.Model<mongoose.Document>;
    constructor(schemaModel: mongoose.Model<mongoose.Document>);
    protected validateParam(param?: any): any;
    find(param?: any, order?: any, page?: number, limit?: number): Promise<T[]>;
    findAll(param?: any, order?: any): Promise<T[]>;
    findOne(param?: any): Promise<T | undefined>;
    count(param?: any): Promise<number>;
    get(_id: string, populate?: any): Promise<T | undefined>;
    aggregate(query: any): Promise<any[]>;
    create(data: any): Promise<T>;
    createMultiple(data: any[]): Promise<T[]>;
    createOrUpdate(query: any, data: any): Promise<T | undefined>;
    update(_id: string, data: any): Promise<boolean>;
    findOneAndUpdate(query: any, data: any): Promise<T | undefined>;
    updateDataByFields(_id: string, data: any, parentField?: string): Promise<void>;
    delete(_id: string, isRealDelete?: boolean): Promise<boolean>;
    toObjectId(_id: string): mongoose.Types.ObjectId;
    paging(page?: number, limit?: number): {
        limit: number;
        skip: number;
    };
}
export default BaseRepository;
