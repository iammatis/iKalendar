import AttachmentParser from '../../src/parser/properties/attachment.parser'

let parser: AttachmentParser

describe('Test Attachment Parser', () => {

    beforeAll(() => {
        parser = new AttachmentParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test fail - wrong type format', () => {
        expect(() => {
            parser.parse('TYPE:wrongType;attachmentValue')
        }).toThrow()
    })

    it('Test simple attachment', () => {
        const geo = parser.parse('attachmentValue')

        expect(geo).toEqual({value: 'attachmentValue'})
    })


    it('Test complex attachment', () => {
        const geo = parser.parse('TYPE=application/json:attachmentValue')

        expect(geo).toEqual({type: 'application/json', value: 'attachmentValue'})
    })

})
