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
			address: 'hcabot@example.com'
		})
	})

	it('Test simple attendee with only one param', () => {
		const attendee = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot')

		expect(attendee).toEqual({
			cn: 'Henry Cabot',
			address: 'hcabot@example.com'
		})
	})

	it('Test simple attendee with params', () => {
		const attendee = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot;ROLE=REQ-PARTICIPANT')

		expect(attendee).toEqual({
			cn: 'Henry Cabot',
			role: 'REQ-PARTICIPANT',
			address: 'hcabot@example.com'
		})
	})
	
	it('Test simple attendee with schedule status', () => {
		const attendee = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot;ROLE=REQ-PARTICIPANT;SCHEDULE-STATUS="2.0"')

		expect(attendee).toEqual({
			cn: 'Henry Cabot',
			role: 'REQ-PARTICIPANT',
			address: 'hcabot@example.com',
			scheduleStatus: '2.0'
		})
	})

	it('Test simple attendee with array of schedule statuses', () => {
		const attendee = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot;ROLE=REQ-PARTICIPANT;SCHEDULE-STATUS="2.0,2.4"')
		expect(attendee).toEqual({
			cn: 'Henry Cabot',
			role: 'REQ-PARTICIPANT',
			address: 'hcabot@example.com',
			scheduleStatus: [ '2.0', '2.4' ]
		})
	})

	it('Test simple attendee with multiple mails', () => {
		const attendee = parser.parse('mailto:ildoit@example.com', 'CN=Jane Doe;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;DELEGATED-FROM="mailto:bob@example.com"')

		expect(attendee).toEqual({
			cn: 'Jane Doe',
			role: 'REQ-PARTICIPANT',
			partstat: 'ACCEPTED',
			delegatedFrom: 'mailto:bob@example.com',
			address: 'ildoit@example.com'
		})
	})

})
