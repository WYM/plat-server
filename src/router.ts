import * as Router from 'koa-router'
import url from './constants/url'
import account from './controllers/account';
import cdkey from './controllers/cdkey'
import cloudsave from './controllers/cloud-save'
import migration from './controllers/migration'

const router = new Router();

router.post(url.ACCOUNT_CREATE, account.onCreate);
router.post(url.ACCOUNT_LOGIN, account.onLogin);
router.post(url.CDKEY_INFO, cdkey.onInfo);
router.post(url.CDKEY_USE, cdkey.onUse);
router.post(url.CLOUD_SAVE_INFO, cloudsave.onInfo);
router.post(url.CLOUD_SAVE_UPLOAD, cloudsave.onUpload);

router.post('/migrate', migration.onInsertTest);

export default router