/**
 * Inspired by soraping/koa-ts
 * https://github.com/soraping/koa-ts
 */

import * as Mongoose from 'mongoose'
import { IUser, UserModel } from '../models/user';
import { ICdkey, CdkeyModel } from '../models/cdkey';
import { ICdkeyTpl, CdkeyTplModel } from '../models/cdkey-tpl';
import { IApp, AppModel } from '../models/app';
import { ISavedata, SavedataModel } from '../models/savedata';

export interface DbConfig {
    host: string
}

export interface Database {
    user: Mongoose.Model<IUser>;
    cdkey: Mongoose.Model<ICdkey>;
    cdkeyTpl: Mongoose.Model<ICdkeyTpl>;
    app: Mongoose.Model<IApp>;
    savedata: Mongoose.Model<ISavedata>
}

export default function init(config: DbConfig): Database {

    (<any>Mongoose).Promise = global.Promise;
    Mongoose.connect(config.host, {
        useMongoClient: true
    });

    const mongoDb = Mongoose.connection;

    mongoDb.on('error', () => {
        console.log(`Unable to connect to database: ${config.host}`);
    });

    mongoDb.once('open', () => {
        console.log(`Connected to database: ${config.host}`);
    });

    return {
        user: UserModel,
        cdkey: CdkeyModel,
        cdkeyTpl: CdkeyTplModel,
        app: AppModel,
        savedata: SavedataModel
    }

}