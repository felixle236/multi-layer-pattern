/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
declare class MongoDB {
    static readonly connection: mongoose.Connection;
    static connect(host: string, port: number, dbName: string, username?: string, password?: string): Promise<mongoose.Connection>;
    static initSchema(schemaDefinition: mongoose.SchemaDefinition): mongoose.Schema;
}
export default MongoDB;
