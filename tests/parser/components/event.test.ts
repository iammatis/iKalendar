import { RRule } from 'rrule'
import { Parser } from '../../../src/parser'
import { loadFile } from '../../utils'

let parser: Parser


describe('Test Event Component Parsing', () => {

	beforeAll(() => {
		parser = new Parser()
	})

	it('Test event with alarms', () => {
		const iCal = loadFile('events/event_with_alarms.ics')
		const calendar = parser.parse(iCal)
        
		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Touch4IT//CalDAV Client//EN',
			events: [
				{
					uid: '8ada08cf-9277-493e-9962-2356aa4343c7',
					start: '20200507T083000Z',
					status: 'CONFIRMED',
					transp: 'OPAQUE',
					duration: {
						isNegative: false,
						minutes: 12
					},
					dtStamp: '20200505T142742Z',
					alarms: [
						{
							trigger: { value: '20200507T090000Z' },
							summary: 'Alarm 1',
							action: 'NONE'
						},
						{
							trigger: { value: '20200507T090000Z' },
							summary: 'Alarm 2',
							action: 'NONE'
						}
					]
				}
			]
		})
	})

	it('Test event with timezone', () => {
		const iCal = loadFile('events/event_with_timezone.ics')
		const calendar = parser.parse(iCal)
        
		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//RDU Software//NONSGML HandCal//EN',
			timezone: {
				tzId: 'America/New_York',
				tzUrl: 'http://tzurl.org/zoneinfo-outlook/America/New_York',
				standard: [
					{
						start: '19701101T020000',
						offsetFrom: '-0400',
						offsetTo: '-0500',
						tzName: 'EST',
						rrule: new RRule({
							freq: RRule.YEARLY,
							bymonth: 11,
							byweekday: [ RRule.SU.nth(1) ]
						})
					}
				],
				daylight: [
					{
						start: '19700308T020000',
						offsetFrom: '-0500',
						offsetTo: '-0400',
						tzName: 'EDT',
						rrule: new RRule({
							freq: RRule.YEARLY,
							bymonth: 3,
							byweekday: [ RRule.SU.nth(2) ]
						})
					}
				],
				xProps: [
					{
						name: 'LIC-LOCATION',
						value: 'America/New_York'
					}
				]
			},
			events: [
				{
					uid: 'guid-1.example.com',
					description: 'Project XYZ Review Meeting',
					summary: 'XYZ Project Review',
					categories: [ 'MEETING' ],
					class: 'PUBLIC',
					dtStamp: '19980309T231000Z',
					created: '19980309T130000Z',
					start: { value: '19980312T083000', tzId: 'America/New_York' },
					end: { value: '19980312T093000', tzId: 'America/New_York' }
				}
			]
		})
	})

})
