import DateParser from '../../src/parser/properties/date.parser'

let parser: DateParser

describe('Test Date Parser', () => {

    beforeAll(() => {
        parser = new DateParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test simple date with UTC', () => {
        const date = parser.parse('20041207T130000Z')

        expect(date).toEqual('20041207T130000Z')
    })

    it('Test simple date without UTC', () => {
        const date = parser.parse('20041207T130000')

        expect(date).toEqual('20041207T130000')
    })

    it('Test date with type', () => {
        const date = parser.parse('TYPE=DATE:20041207')

        expect(date).toEqual({type: 'DATE', value: '20041207'})
    })

    it('Test date with tzid', () => {
        const date = parser.parse('TZID=Europe/Bratislava:20041207T130000')

        expect(date).toEqual({tzId: 'Europe/Bratislava', value: '20041207T130000'})
    })

})
