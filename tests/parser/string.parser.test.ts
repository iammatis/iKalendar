import StringParser from '../../src/parser/properties/string.parser'

let parser: StringParser

describe('Test String Parser', () => {

	beforeAll(() => {
		parser = new StringParser()
	})

	it('Test fail - empty string', () => {
		expect(parser.parse('')).toEqual('')
	})

	it('Test simple string', () => {
		const str = parser.parse('Event\'s summary')

		expect(str).toEqual('Event\'s summary')
	})

	it('String with semicolon', () => {
		const str = parser.parse('Event \\; summary')

		expect(str).toEqual('Event ; summary')
	})

})
