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
});