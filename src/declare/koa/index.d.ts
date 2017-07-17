import * as Koa from "koa";
import * as compose from 'koa-compose'
import * as Redis from 'ioredis'
import { Database } from '../../middleware/db'
import Msg from '../../constants/msg'

declare module "koa" {
    interface Context {
        params: any; //koa-router
        service: {
            db?: Database
            redis?: Redis.Redis
            msg?: Msg
            imsg?: Msg
        };
    }

    interface Request extends BaseRequest {
        body: any; // koa-parser
    }
}