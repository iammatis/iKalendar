import FreeBusyParser from '../../src/parser/properties/freebusy.parser'
import { FreeBusyProperty } from '../../src/types'

let parser: FreeBusyParser

describe('Test String Parser', () => {

	beforeAll(() => {
		parser = new FreeBusyParser()
	})

	it('Test fail - empty string', () => {
		expect(() => {
			parser.parse('')
		}).toThrow()
	})

	it('Test simple datetime freebusy', () => {
		const freebusy: FreeBusyProperty = parser.parse('19980314T233000Z/19980315T003000Z')

		expect(freebusy).toEqual({ value: [ { start: '19980314T233000Z', end: '19980315T003000Z' } ] })
	})
    
	it('Test simple datetime & duration freebusy', () => {
		const freebusy: FreeBusyProperty = parser.parse('19980314T233000Z/PT5H30M')

		expect(freebusy).toEqual({ value: [ { start: '19980314T233000Z', duration: { isNegative: false, hours: 5, minutes: 30 } } ] })
	})
    
	it('Test complex freebusy', () => {
		const freebusy: FreeBusyProperty = parser.parse('19970308T160000Z/PT8H30M', 'FBTYPE=BUSY-UNAVAILABLE')

		expect(freebusy).toEqual({ type: 'BUSY-UNAVAILABLE', value: [ { start: '19970308T160000Z', duration: { isNegative: false, hours: 8, minutes: 30 } } ] })
	})

})
