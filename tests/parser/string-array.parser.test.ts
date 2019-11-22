import StringArrayParser from '../../src/parser/properties/string-array.parser'

let parser: StringArrayParser

describe('Test String Array Parser', () => {

	beforeAll(() => {
		parser = new StringArrayParser()
	})

	it('Test fail - empty array', () => {
		expect(() => {
			parser.parse('')
		}).toThrow()
	})

	it('Test single element', () => {
		const str = parser.parse('CONFERENCE')

		expect(str).toEqual([ 'CONFERENCE' ])
	})

	it('Test multiple elements', () => {
		const str = parser.parse('MEETING,PROJECT')

		expect(str).toEqual([ 'MEETING', 'PROJECT' ])
	})

})
