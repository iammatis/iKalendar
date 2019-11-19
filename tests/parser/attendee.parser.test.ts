import AttendeeParser from '../../src/parser/properties/attendee.parser'

let parser: AttendeeParser

describe('Test Attendee Parser', () => {

    beforeAll(() => {
        parser = new AttendeeParser()
    })

    it('Test fail - empty string', () => {
        expect(() => {
            parser.parse('')
        }).toThrow()
    })

    it('Test simple attendee', () => {
        const attendee = parser.parse('mailto:hcabot@example.com')

        expect(attendee).toEqual({
            address: 'mailto:hcabot@example.com'
        })
    })

    it('Test simple attendee with only one param', () => {
        const attendee = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot')

        expect(attendee).toEqual({
            cn: 'Henry Cabot',
            address: 'mailto:hcabot@example.com'
        })
    })

    it('Test simple attendee with params', () => {
        const attendee = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot;ROLE=REQ-PARTICIPANT')

        expect(attendee).toEqual({
            cn: 'Henry Cabot',
            role: 'REQ-PARTICIPANT',
            address: 'mailto:hcabot@example.com'
        })
    })

    it('Test simple attendee with multiple mails', () => {
        const attendee = parser.parse('mailto:ildoit@example.com', 'CN=Jane Doe;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;DELEGATED-FROM="mailto:bob@example.com"')

        expect(attendee).toEqual({
            cn: 'Jane Doe',
            role: 'REQ-PARTICIPANT',
            partstat: 'ACCEPTED',
            delegatedFrom: '"mailto:bob@example.com"',
            address: 'mailto:ildoit@example.com'
        })
    })

})
