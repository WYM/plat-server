import * as Koa from 'koa';
import MsgCode from '../constants/msg-code'
import Msg from '../constants/msg'
import Config from '../config'
import Encrypt from '../utils/encrypt'
import Validate from '../utils/validate'
import Trace from '../utils/trace'
import Mathematic from '../utils/math'
import { IUser, UserModel } from '../models/user';
import { ICdkey, CdkeyModel } from '../models/cdkey';
import { ICdkeyTpl, CdkeyTplModel } from '../models/cdkey-tpl';
import { IApp, AppModel } from '../models/app';

export default class Account {

    public static async onInsertTest(ctx: Koa.Context, next) {
        const { db, redis, msg } = ctx.service;

        const app_ids = [];
        for (let i = 0; i < 6; i++) {
            const entity: IApp = new db.app({
                name: '测试App' + i,
                identifier: 'app_' + i
            });

            const result = await entity.save();
            app_ids.push(result.id);
        }

        const tpl_ids = [];
        for (let i = 0; i < 3; i++) {
            const entity: ICdkeyTpl = new db.cdkeyTpl({
                appid: app_ids[Mathematic.getRandomInt(0, app_ids.length - 1)]
            });

            const result = await entity.save();
            tpl_ids.push(result.id);
        }

        const cdkey_ids = [];
        for (let i = 0; i < 20; i++) {
            const entity: ICdkey = new db.cdkey({
                tpl: tpl_ids[Mathematic.getRandomInt(0, tpl_ids.length - 1)],
                key: Encrypt.generateSalt(16)
            });

            const result = await entity.save();
            cdkey_ids.push(result.id);
        }

        ctx.body = Msg.create();
    }

}