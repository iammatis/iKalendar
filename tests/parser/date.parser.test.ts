import DateParser from '../../src/parser/properties/date.parser'

let parser: DateParser

describe('Test Date Parser', () => {

	beforeAll(() => {
		parser = new DateParser()
	})

	describe('Fails', () => {
		it('Test fail - empty string', () => {
			expect(() => {
				parser.parse('')
			}).toThrow()
		})
	})

	describe('UTC time', () => {
		it('Test simple date with UTC', () => {
			const date = parser.parse('20041207T130000Z')
	
			expect(date).toEqual('2004-12-07T13:00:00.000Z')
		})
	})

	describe('Local Time', () => {
		it('Test simple date without UTC', () => {
			const date = parser.parse('20041207T130000')
	
			expect(date).toEqual('2004-12-07T13:00:00.000Z')
		})
	
		it('Test date with type', () => {
			const date = parser.parse('20041207', 'VALUE=DATE')
	
			expect(date).toEqual({ type: 'DATE', value: '2004-12-06T23:00:00.000Z' })
		})
	
		it('Test date with tzid', () => {
			const date = parser.parse('20040907T130000', 'TZID=Europe/Bratislava')
	
			expect(date).toEqual({ tzId: 'Europe/Bratislava', value: '2004-09-07T11:00:00.000Z' })
		})
	})

})
