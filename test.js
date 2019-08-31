const memoization = require('./memoizaton');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('memoization', function () {
    let clock;

    beforeEach( function() {
        clock = sinon.useFakeTimers();
    });

    afterEach( function() {
        clock.restore();
    });

    it('should memoize function result', () =>{
        let returnValue = 5;
        const parameter = 'c544d3ae-a72d-4755-8ce5-d25db415b776';
        const testFunction =  (key) => returnValue;

        const memoized = memoization.memoize(testFunction, (key) => key, 1000);
        expect(memoized(parameter)).to.equal(5);

        returnValue += 5;

        // TODO currently fails, should work after implementing the memoize function
        expect(memoized(parameter)).to.equal(5);
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

        parameter = 2n ** 53n;
        expect(memoized(parameter)).to.equal(10);
        expect(memoized(2n ** 53n)).to.equal(10);
        expect(memoized(9007199254740992)).to.equal(10);

        returnValue += 5;

        expect(memoized(2/0)).to.equal(15);

        returnValue += 5;

        expect(memoized(Infinity)).to.equal(15);
        expect(memoized(2/-0)).to.equal(20);
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
    });
});