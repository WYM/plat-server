import Config from '../config'

export default class Validate {

    public static email(val: string): boolean {
        if (!val) {
            return false;
        }

        if (!Validate.validateLength(val, Config.validate.email)) {
            return false;
        }

        // TODO check regex
        if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)) {
            return false;
        }

        return true;
    }

    public static username(val: string): boolean {
        if (!val) {
            return false;
        }

        if (!Validate.validateLength(val, Config.validate.username)) {
            return false;
        }

        // TODO check regex
        if (!/[a-zA-z]*/.test(val)) {
            return false;
        }

        return true;
    }

    public static password(val: string): boolean {
        if (!val) {
            return false;
        }

        if (!Validate.validateLength(val, Config.validate.password)) {
            return false;
        }

        if (!/[\x21-\x7E]*/.test(val)) {
            return false;
        }

        return true;
    }

    public static validateLength(val: string, limit: Array<number>): boolean {
        return !(val.length < limit[0] || val.length > limit[1]);
    }

}