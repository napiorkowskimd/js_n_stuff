var assert = require('chai').assert;

var Model = require('../model.js')

describe('model', () => {
    var model = new Model(undefined)
    var data = [0, 1, 2, 4, 5, 7, 8, 9, 23, 54, 77, 77, 77, 98, 100]
    data = data.map((d) => {
    return {
        timestamp: d
    }
    })
    model.setDataForTesting(data)
    describe('findLeft', () => {
        it('returns targets index if target is found', () => {
            assert.equal(model.findLeft(data[0].timestamp), 0)
            assert.equal(model.findLeft(data[1].timestamp), 1)
            assert.equal(model.findLeft(data[5].timestamp),  5)
        })

        it('returns next smaller element if target is not found', () => {
            assert.equal(model.findLeft(3), 2)
            assert.equal(model.findLeft(6), 4)
            assert.equal(model.findLeft(101), 14)
            assert.equal(model.findLeft(1324), 14)
        })

        it('returns past end index if all elements are grater that target', () => {
            assert.equal(model.findLeft(-1), data.length)
            assert.equal(model.findLeft(-12345), data.length)
        })

        it('returns leftmost duplicate if target occurs more than once', () => {
            assert.equal(model.findLeft(77), 10)
        })

        it('returns last element if target is Infinity', () =>{
            assert.equal(model.findLeft(Infinity), data.length - 1)
        })

        it('returns past end index if target is -Infinity', () => {
            assert.equal(model.findLeft(-Infinity), data.length)
        })
    })

    describe('findRight', () => {
        it('returns targets index if target is found', () => {
            assert.equal(model.findRight(data[0].timestamp), 0)
            assert.equal(model.findRight(data[1].timestamp), 1)
            assert.equal(model.findRight(data[5].timestamp), 5)
        })

        it('returns next greater element if target is not found', () => {
            assert.equal(model.findRight(99), data.length - 1)
            assert.equal(model.findRight(3), 3)
            assert.equal(model.findRight(-1), 0)
            assert.equal(model.findRight(-1234), 0)
        })

        it('returns past end index if all elements are smaller than target', () => {
            assert.equal(model.findRight(1234), data.length)
            assert.equal(model.findRight(101), data.length)
        })

        it('returns rightmost duplicate if target occurs more than once', () => {
            assert.equal(model.findRight(77), 12)
        })

        it('returns past end index if target is Infinity', () => {
            assert.equal(model.findRight(Infinity), data.length)
        })

        it('returns first element if target is -Infinity', () => {
            assert.equal(model.findRight(-Infinity), 0)
        })
    })

    describe('getData', () => {

    })
})