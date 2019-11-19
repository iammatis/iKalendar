import NumberParser from '../../src/parser/properties/number.parser'

let parser: NumberParser

describe('Test Attachment Parser', () => {

    beforeAll(() => {
        parser = new NumberParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test fail - wrong number', () => {
        expect(() => {
            parser.parse('abeceda')
        }).toThrow()
    })

    it('Test integer', () => {
        const geo = parser.parse('123')

        expect(geo).toEqual(123)
    })


    it('Test float', () => {
        const geo = parser.parse('123.45')

        expect(geo).toEqual(123.45)
    })

})
