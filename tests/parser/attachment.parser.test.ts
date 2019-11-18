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

    it('Test simple attachment', () => {
        const attachment = parser.parse('attachmentValue')

        expect(attachment).toEqual({value: 'attachmentValue'})
    })

    it('Test complex attachment', () => {
        const attachment = parser.parse('attachmentValue', 'VALUE=application/json')

        expect(attachment).toEqual({type: 'application/json', value: 'attachmentValue'})
    })

})
