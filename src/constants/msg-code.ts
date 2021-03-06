enum MsgCode {
    OK = 'OK',

    HTTP_INVALID_PARAM = 'HTTP_INVALID_PARAM',

    EMAIL_REQUIRED = 'EMAIL_REQUIRED',
    USERNAME_REQUIRED = 'USERNAME_REQUIRED',
    PASSWORD_REQUIRED = 'PASSWORD_REQUIRED',

    EMAIL_INVALID = 'EMAIL_INVALID',
    USERNAME_INVALID = 'USERNAME_INVALID',
    PASSWORD_INVALID = 'PASSWORD_INVALID',

    EMAIL_OCCUPIED = 'EMAIL_OCCUPIED',
    USERNAME_OCCUPIED = 'USERNAME_OCCUPIED',

    EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND',
    USERNAME_NOT_FOUND = 'USERNAME_NOT_FOUND',
    PASSWORD_INCORRECT = 'PASSWORD_INCORRECT',

    INVALID_TOKEN = 'INVALID_TOKEN',

    CDKEY_INVALID = 'CDKEY_INVALID',
    CDKEY_USED = 'CDKEY_USED',
    APP_ALREADY_HAVE = 'APP_ALREADY_HAVE',

    NO_SAVE = 'NO_SAVE',

    DB_FAILED = 'DB_FAILED'

}

export default MsgCode