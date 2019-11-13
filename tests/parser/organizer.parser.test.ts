import OrganizerParser from '../../src/parser/properties/organizer.parser'

let parser: OrganizerParser

describe('Test Organizer Parser', () => {

    beforeAll(() => {
        parser = new OrganizerParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test fail - invalid parameter', () => {
        expect(() => {
            parser.parse('CN=Jane Doe;ROLE=REQ-PARTICIPANT:mailto:ildoit@example.com')
        }).toThrow()
    })

    it('Test simple organizer', () => {
        const organizer = parser.parse('mailto:hcabot@example.com')

        expect(organizer).toEqual({
            address: 'hcabot@example.com'
        })
    })

    it('Test simple organizer with params', () => {
        const organizer = parser.parse('CN=Henry Cabot:mailto:hcabot@example.com')

        expect(organizer).toEqual({
            cn: 'Henry Cabot',
            address: 'hcabot@example.com'
        })
    })

    it('Test simple organizer with multiple mails', () => {
        const organizer = parser.parse('CN=Jane Doe;DIR="ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)":mailto:ildoit@example.com')

        expect(organizer).toEqual({
            cn: 'Jane Doe',
            dir: '"ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)"',
            address: 'ildoit@example.com'
        })
    })

})
