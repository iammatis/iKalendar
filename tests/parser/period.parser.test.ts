import PeriodParser from '../../src/parser/properties/period.parser'

let parser: PeriodParser

describe('Test String Array Parser', () => {

	beforeAll(() => {
		parser = new PeriodParser()
	})

	it('Test fail - empty string', () => {
		expect(() => {
			parser.parse('')
		}).toThrow()
	})

	it('Test start & end datetime period', () => {
		const period = parser.parse('19980314T233000Z/19980315T003000Z')

		expect(period).toEqual({ start: '19980314T233000Z', end: '19980315T003000Z' })
	})

	it('Test start datetime & duration period', () => {
		const period = parser.parse('19970101T180000Z/PT5H30M')

		expect(period).toEqual({ start: '19970101T180000Z', duration: { isNegative: false, hours: 5, minutes: 30 } })
	})

})
