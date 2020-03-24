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

	it('Test simple organizer', () => {
		const organizer = parser.parse('mailto:hcabot@example.com')

		expect(organizer).toEqual({
			address: 'hcabot@example.com'
		})
	})

	it('Test simple organizer with params', () => {
		const organizer = parser.parse('mailto:hcabot@example.com', 'CN=Henry Cabot')

		expect(organizer).toEqual({
			cn: 'Henry Cabot',
			address: 'hcabot@example.com'
		})
	})

	it('Test simple organizer with multiple mails', () => {
		const organizer = parser.parse('mailto:ildoit@example.com', 'CN=Jane Doe;DIR="ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)"')

		expect(organizer).toEqual({
			cn: 'Jane Doe',
			dir: '"ldap://example.com:6666/o=DC%20Associates,c=US???(cn=John%20Smith)"',
			address: 'ildoit@example.com'
		})
	})

})
