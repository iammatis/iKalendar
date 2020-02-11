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
	
			expect(date).toEqual('20041207T130000Z')
		})
	})

	describe('Local Time', () => {
		it('Test simple date without UTC', () => {
			const date = parser.parse('20041207T130000')
	
			expect(date).toEqual('20041207T130000')
		})
	
		it('Test date with type', () => {
			const date = parser.parse('20041207', 'VALUE=DATE')
	
			expect(date).toEqual({ type: 'DATE', value: '20041207' })
		})
	
		it('Test date with tzid', () => {
			const date = parser.parse('20041207T130000', 'TZID=Europe/Bratislava')
	
			expect(date).toEqual({ tzId: 'Europe/Bratislava', value: '20041207T130000' })
		})
	})

	describe('ISO time', () => {
		it('Test simple date in ISO format', () => {
			const date = parser.parse('2020-02-07T11:04:25+0000')
	
			expect(date).toEqual('20200207T110425Z')
		})

		it('Test simple date in ISO format 2', () => {
			const date = parser.parse('2020-02-07T11:04:25+0600')
	
			expect(date).toEqual('20200207T110425Z')
		})
	})


})
