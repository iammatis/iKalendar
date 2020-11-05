import RRule from 'rrule'
import { Parser } from '../../../src/parser'
import { loadFile } from '../../utils'

let parser: Parser


describe('Test TimeZone Component Parsing', () => {

	beforeAll(() => {
		parser = new Parser()
	})
	it('', () => {expect(true).toEqual(true)})

	it('Test simple timezone', () => {
		const iCal = loadFile('timezones/europe_bratislava.ics')
		const calendar = parser.parse(iCal)
        
		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Touch4IT//CalDAV Client//EN',
			timezone: {
				tzId: 'Europe/Bratislava',
				tzUrl: 'http://tzurl.org/zoneinfo-outlook/Europe/Bratislava',
				xProps: [
					{
						name: 'LIC-LOCATION',
						value: 'Europe/Bratislava'
					}
				],
				standard: [
					{
						offsetFrom: '+0200',
						offsetTo: '+0100',
						tzName: 'CET',
						start: '19701025T030000',
						rrule: new RRule({
							freq: RRule.YEARLY,
							bymonth: 10,
							byweekday: [ RRule.SU.nth(-1) ]
						})
					}
				],
				daylight: [
					{
						offsetFrom: '+0100',
						offsetTo: '+0200',
						tzName: 'CEST',
						start: '19700329T020000',
						rrule: new RRule({
							freq: RRule.YEARLY,
							bymonth: 3,
							byweekday: [ RRule.SU.nth(-1) ]
						})
					}
				]
			}
		})
	})

})
