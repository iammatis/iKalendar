import DurationParser from '../../src/parser/properties/duration.parser'

let parser: DurationParser

describe('Test Duration Parser', () => {

    beforeAll(() => {
        parser = new DurationParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test fail - invalid duration', () => {
        expect(() => {
            parser.parse('PW2D')
        }).toThrow()
    })

    it('Test fail - gibberish string', () => {
        expect(() => {
            parser.parse('dsadasd')
        }).toThrow()
    })

    it('Test duration with days', () => {
        const duration = parser.parse('P3D')

        expect(duration).toEqual({isNegative: false, days: 3})
    })

    it('Test duration with weeks', () => {
        const duration = parser.parse('P2W')

        expect(duration).toEqual({isNegative: false, weeks: 2})
    })

    it('Test duration with days and weeks', () => {
        const duration = parser.parse('P2W3D')

        expect(duration).toEqual({isNegative: false, weeks: 2, days: 3})
    })

    it('Test duration with only hours', () => {
        const duration = parser.parse('PT4H')

        expect(duration).toEqual({isNegative: false, hours: 4})
    })

    it('Test duration with only minutes', () => {
        const duration = parser.parse('PT5M')

        expect(duration).toEqual({isNegative: false, minutes: 5})
    })

    it('Test duration with only seconds', () => {
        const duration = parser.parse('PT6S')

        expect(duration).toEqual({isNegative: false, seconds: 6})
    })

    it('Test duration with only time', () => {
        const duration = parser.parse('PT4H5M6S')

        expect(duration).toEqual({isNegative: false, hours: 4, minutes:5, seconds: 6})
    })

    it('Test duration with days and time', () => {
        const duration = parser.parse('P2W3DT4H5M6S')

        expect(duration).toEqual({isNegative: false, weeks: 2, days: 3, hours: 4, minutes:5, seconds: 6})
    })

})
