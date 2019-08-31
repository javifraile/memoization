const memoization = require('./memoizaton');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('memoization', function () {
    let clock;
    let logs;
    let originalLog;

    const getCalculateLog = key => `Calculating result with key: ${key}`;
    const getFetchLog = key => `Fetching key: ${key} from cache`;
    const getDeleteLog = key => `Deleting ${key} in cache`;

    beforeEach( function() {
        clock = sinon.useFakeTimers();
        originalLog = console.log;
        logs = [];
        console.log = (...args) => {
            logs.push(...args);
            originalLog(...args);
        };
    });

    afterEach( function() {
        clock.restore();
        console.log = originalLog;
    });

    it('should memoize function result', () =>{
        let returnValue = 5;
        const parameter = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
        const testFunction =  (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        expect(memoized(parameter)).to.equal(5);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog(parameter));
    });

    it('should memoize and after timeout call original function again', () => {
        let returnValue = 5;
        const parameter = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        clock.tick( 500 );

        expect(memoized(parameter)).to.equal(5);

        clock.tick( 500 );

        expect(memoized(parameter)).to.equal(10);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog(parameter));
        expect(logs[2]).to.equal(getDeleteLog(parameter));
        expect(logs[3]).to.equal(getCalculateLog(parameter));
    });

    it('should memoize the first argument of the function and after timeout call original function again', () => {
        let returnValue = 5;
        const parameter = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, null, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        clock.tick( 500 );

        expect(memoized(parameter)).to.equal(5);

        clock.tick( 500 );

        expect(memoized(parameter)).to.equal(10);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog(parameter));
        expect(logs[2]).to.equal(getDeleteLog(parameter));
        expect(logs[3]).to.equal(getCalculateLog(parameter));
    });

    it('should never delete the cache with no timeout', () => {
        let returnValue = 5;
        const parameter = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 0);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        clock.tick( 5000000 );

        expect(memoized(parameter)).to.equal(5);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog(parameter));
    });

    it('should memoize function result with parameter of types undefined and null', () => {
        let returnValue = 5;
        let parameter;
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        expect(memoized(undefined)).to.equal(5);
        expect(memoized()).to.equal(5);
        expect(memoized('undefined')).to.equal(5);

        parameter = null;
        expect(memoized(parameter)).to.equal(10);

        returnValue += 5;

        expect(memoized(null)).to.equal(10);
        expect(memoized('null')).to.equal(10);

        expect(logs[0]).to.equal(getCalculateLog());
        expect(logs[1]).to.equal(getFetchLog(undefined));
        expect(logs[2]).to.equal(getFetchLog());
        expect(logs[3]).to.equal(getFetchLog('undefined'));
        expect(logs[4]).to.equal(getCalculateLog(parameter));
        expect(logs[5]).to.equal(getFetchLog(null));
        expect(logs[6]).to.equal(getFetchLog('null'));
    });

    it('should memoize function result with parameter of type number', () => {
        let returnValue = 5;
        let parameter = 5000;
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        expect(memoized(parameter.toString())).to.equal(5);

        expect(memoized(parameter)).to.equal(5);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog(parameter.toString())).and.to.equal(getFetchLog(5000));

        parameter = 2n ** 53n;
        expect(memoized(parameter)).to.equal(10);
        expect(memoized(2n ** 53n)).to.equal(10);
        expect(memoized(9007199254740992)).to.equal(10);

        expect(logs[3]).to.equal(getCalculateLog(parameter));
        expect(logs[4]).to.equal(getFetchLog(2n ** 53n));
        expect(logs[5]).to.equal(getFetchLog(9007199254740992));

        returnValue += 5;

        expect(memoized(2/0)).to.equal(15);

        returnValue += 5;

        expect(memoized(2/-0)).to.equal(20);

        expect(logs[6]).to.equal(getCalculateLog(Infinity));
        expect(logs[7]).to.equal(getCalculateLog(-Infinity));
    });

    it('should memoize function result with parameters true and false', () => {
        let returnValue = 5;
        const parameter = true;
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        expect(memoized('true')).to.equal(5);

        expect(memoized(false)).to.equal(10);

        returnValue += 5;

        expect(memoized('false')).to.equal(10);

        expect(logs[0]).to.equal(getCalculateLog(true));
        expect(logs[1]).to.equal(getFetchLog('true'));
        expect(logs[2]).to.equal(getCalculateLog(false));
        expect(logs[3]).to.equal(getFetchLog('false'));
    });

    it('should memoize function result with parameter of type array and its equivalent in array, regardless of the dimension', () => {

        let returnValue = 5;
        const parameter = [1, 2];
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        expect(memoized('1,2')).to.equal(5);

        expect(memoized([1,[2]])).to.equal(5);

        expect(memoized([[1],2])).to.equal(5);

        expect(memoized([[1],[2]])).to.equal(5);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog('1,2'));
        expect(logs[2]).to.equal(getFetchLog([1,[2]]));
        expect(logs[3]).to.equal(getFetchLog([[1],2]));
        expect(logs[4]).to.equal(getFetchLog([[1],[2]]));
    });

    it('should memoize same function result with same key for any object', () => {

        let returnValue = 5;
        const parameter = {hello: 1};
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        expect(memoized({hello: 2})).to.equal(5);

        expect(memoized('[object Object]')).to.equal(5);

        expect(logs[0]).to.equal(getCalculateLog(parameter));
        expect(logs[1]).to.equal(getFetchLog({hello: 2}));
        expect(logs[2]).to.equal(getFetchLog('[object Object]'));
    });

    it('should memoize function result with parameter of type date', () => {

        let returnValue = 5;
        const parameterDate1 = new Date();
        const testFunction = (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameterDate1)).to.equal(5);

        returnValue += 5;

        expect(memoized(parameterDate1)).to.equal(5);

        clock.tick( 5000 );

        const parameterDate2 = new Date();

        expect(memoized(parameterDate2)).to.equal(10);

        expect(logs[0]).to.equal(getCalculateLog(parameterDate1));
        expect(logs[1]).to.equal(getFetchLog(parameterDate1));
        expect(logs[2]).to.equal(getDeleteLog(parameterDate1));
        expect(logs[3]).to.equal(getCalculateLog(parameterDate2));
    });

    it('should memoize function result with parameter of type function', () => {

        let returnValue = 5;
        const testFunction = (key) => returnValue;
        const resolver = key => key;

        const memoized = memoization.memoize(testFunction, resolver, 1000);
        expect(memoized(testFunction)).to.equal(5);

        returnValue += 5;

        clock.tick( 500 );

        expect(memoized(testFunction)).to.equal(5);
        expect(memoized(resolver)).to.equal(10);

        clock.tick( 500 );

        expect(memoized(testFunction)).to.equal(10);
        expect(memoized(resolver)).to.equal(10);

        expect(logs[0]).to.equal(getCalculateLog(testFunction));
        expect(logs[1]).to.equal(getFetchLog('' + testFunction));
        expect(logs[2]).to.equal(getCalculateLog(resolver));
        expect(logs[3]).to.equal(getDeleteLog(testFunction));
        expect(logs[4]).to.equal(getCalculateLog('' + testFunction));
        expect(logs[5]).to.equal(getFetchLog('' + resolver));
    });
});