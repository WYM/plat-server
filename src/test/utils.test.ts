import * as mocha from 'mocha'
import { expect } from 'chai'

import Mathematic from '../utils/math'
import Time from '../utils/time'
import Encrpty from '../utils/encrypt'
import Validate from '../utils/validate'

describe('utils', () => {
    describe('math', () => {
        describe('.random()', () => {

            it('should be integer', () => {
                expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).to.contains(Mathematic.getRandomInt(0, 10));
            });

            it('should be random', () => {
                expect(Mathematic.getRandomInt(0, 1000)).not.equals(Mathematic.getRandomInt(0, 1000));
            });

            it('should between 0 and 10', () => {
                expect(Mathematic.getRandomInt(0, 10)).to.gte(0).lte(10);
            });

        });
    });
    describe('time', () => {
        describe('.dateToStr()', () => {

            it('should format date string', () => {
                expect(Time.dateToStr(1500356460783)).equals('2017-07-18 13:41:00');
            });

            it('should format date with parameters', () => {
                expect(Time.dateToStr(1500356460783, 'M-d h:m:ss')).equals('7-18 13:41:00');
            });

        });
    });
    describe('encrypt', () => {
        describe('.encryptPassword()', () => {

            const salt = 'SY1DBHx1';
            const pass = '1a2B3c4d_5E';

            it('should have same result', () => {
                expect(Encrpty.encryptPassword(pass, salt)).equals(Encrpty.encryptPassword(pass, salt));
            });

            it('should not have equals to password or salt', () => {
                const result = Encrpty.encryptPassword(pass, salt);
                expect(result).not.equals(pass);
                expect(result).not.equals(salt);
            });

        });

        describe('.generateSalt()', () => {

            it('should be random', () => {
                expect(Encrpty.generateSalt(8)).not.equals(Encrpty.generateSalt(8));
            });

            it('should has required length', () => {
                expect(Encrpty.generateSalt(8)).has.length(8);
            });

        });

        describe('.generateToken()', () => {

            const uid = '596332906b88f60dc868e9c6';

            it('should be random', () => {
                expect(Encrpty.generateToken(uid)).not.equals(Encrpty.generateToken(uid));
            });

            it('should have length of 32.', () => {
                expect(Encrpty.generateToken(uid)).has.length(32);
            });

        });
    });

    describe('validate', () => {

        describe('.validateLength()', () => {

            it('should validate length', () => {
                expect(Validate.validateLength('test', [1, 5])).true;
                expect(Validate.validateLength('testtest', [1, 5])).false;
            });

        });
    });

});