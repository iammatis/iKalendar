import TriggerParser from '../../src/parser/properties/trigger.parser'

let parser: TriggerParser

describe('Test Trigger Parser', () => {

    beforeAll(() => {
        parser = new TriggerParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    // it('Test fail - invalid parameter', () => {
    //     expect(() => {
    //         parser.parse('CN=Jane Doe;ROLE=REQ-PARTICIPANT:mailto:ildoit@example.com')
    //     }).toThrow()
    // })

    it('Test simple trigger with date-time', () => {
        const trigger = parser.parse('19980403T120000Z')

        expect(trigger).toEqual({value: '19980403T120000Z'})
    })

    it('Test simple trigger with duration', () => {
        const trigger = parser.parse('-PT15M')

        expect(trigger).toEqual({value: {isNegative: true, minutes: 15}})
    })

    it('Test trigger with type and date-time', () => {
        const trigger = parser.parse('19970317T133000Z', 'VALUE=DATE-TIME')

        expect(trigger).toEqual({type: 'DATE-TIME', value: '19970317T133000Z'})
    })

    it('Test complex trigger', () => {
        const trigger = parser.parse('19970317T133000Z', 'RELATED=END;VALUE=DATE-TIME')

        expect(trigger).toEqual({related: 'END', type: 'DATE-TIME', value: '19970317T133000Z'})
    })

})
