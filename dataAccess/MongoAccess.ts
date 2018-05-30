import * as mongoose from 'mongoose';

class MongoAccess {
    static get connection(): mongoose.Connection {
        return mongoose.connection;
    }

    static connect(host: string, port: number, dbName: string, username?: string, password?: string): Promise<mongoose.Connection | undefined> {
        (<any>mongoose).Promise = Promise;
        let uri = `mongodb://${host}:${port}/${dbName}`;

        let options = <mongoose.ConnectionOptions>{
            poolSize: 10, // default is 5
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 500 // Reconnect every 500ms
        };

        if (username && password) {
            options.user = username;
            options.pass = password;
        }

        return mongoose.connect(uri, options).then(mongo => mongo.connection).catch(error => {
            console.log('Connect mongodb', error.message);
            return undefined;
        });
    }

    static initSchema(schemaDefinition: mongoose.SchemaDefinition): mongoose.Schema {
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

        schema.pre('update', function(this: any, next) {
            this.updatedAt = Date.now; // eslint-disable-line
            next();
        });

        return schema;
    }
}

Object.seal(MongoAccess);
export default MongoAccess;
