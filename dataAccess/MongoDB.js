"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class MongoDB {
    static get connection() {
        return mongoose.connection;
    }
    static async connect(host, port, dbName, username, password) {
        mongoose.Promise = Promise;
        let uri = `mongodb://${host}:${port}/${dbName}`;
        let options = {
            poolSize: 10,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500
        };
        if (username && password) {
            options.user = username;
            options.pass = password;
        }
        await mongoose.connect(uri, options);
        return mongoose.connection;
    }
    static initSchema(schemaDefinition) {
        schemaDefinition.createdAt = {
            type: Date,
            default: Date.now
        };
        schemaDefinition.updatedAt = {
            type: Date,
            default: Date.now
        };
        schemaDefinition.deletedAt = {
            type: Date
        };
        let schema = new mongoose.Schema(schemaDefinition);
        schema.pre('update', function (next) {
            this.updatedAt = Date.now;
            next();
        });
        return schema;
    }
}
Object.seal(MongoDB);
exports.default = MongoDB;
//# sourceMappingURL=MongoDB.js.map