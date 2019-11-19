import GeoParser from '../../src/parser/properties/geo.parser'

let parser: GeoParser

describe('Test String Parser', () => {

    beforeAll(() => {
        parser = new GeoParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test fail - only lat', () => {
        expect(() => {
            parser.parse('123.42;')
        }).toThrow()
    })

    it('Test fail - only lon', () => {
        expect(() => {
            parser.parse(';123.42')
        }).toThrow()
    })

    it('Test simple geo', () => {
        const geo = parser.parse('123.45;678.99')

        expect(geo).toEqual({lat: 123.45, lon: 678.99})
    })

})
