import { readFileSync } from 'fs'
import { join } from 'path'

import Builder from '../src/builder'
import RRule from 'rrule'
import BuildingError from '../src/exceptions/builder.error'

const loadFile = (name: string): string => readFileSync(join(__dirname, `./fixtures/${name}`), 'utf-8')

describe('Test Builder Class', () => {

	describe('Test events', () => {

		it('Test simple event', () => {

			const file = loadFile('events/simple_event.ics')

			const builder = new Builder({
				version: '2.0',
				prodId: '-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
				events: [
					{
						dtStamp: '20101231T083000Z',
						uid: 'uid1@example.com',
						start: {
							value: '20101231',
							type: 'DATE'
						}
					}
				]
			})
			const data = builder.build()
			expect(data).toEqual(file)
		})

		it('Test multiple attendees', () => {

			const file = loadFile('events/multiple_attendees.ics')

			const builder = new Builder({
				version: '2.0',
				prodId: '-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
				events: [
					{
						dtStamp: '20101231T083000Z',
						uid: 'uid1@example.com',
						attendees: [
							{
								cn: 'Henry Cabot',
								address: 'hcabot@example.com',
								role: 'REQ-PARTICIPANT',
								scheduleStatus: '2.0'
							},
							{
								address: 'ildoit@example.com',
								role: 'REQ-PARTICIPANT',
								delegatedFrom: [ 'bob@example.com' ],
								partstat: 'ACCEPTED',
								cn: 'Jane Doe',
								scheduleStatus: [ '2.0', '2.4' ]
							}
						],
						xProps: [
							{
								name: 'testname',
								value: 'random xprop value'
							}
						]
					}
				]
			})
			const data = builder.build()
			expect(data).toEqual(file)
		})

		it('Test multiple events', () => {

			const file = loadFile('events/multiple_events.ics')

			const rrule = new RRule({
				freq: RRule.WEEKLY,
				interval: 5,
				byweekday: [ RRule.MO, RRule.FR ],
				until: new Date(Date.UTC(2012, 12, 31))
			});

			const builder = new Builder({
				version: '2.0',
				prodId: '-//Example Corp.//CalDAV Client//EN',
				events: [
					{
						dtStamp: '20041210T183904Z',
						uid: '1@example.com',
						start: '20041207T120000Z',
						end: '20041207T130000Z',
						summary: 'One-off Meeting'
					},
					{
						dtStamp: '20041210T183838Z',
						uid: '2@example.com',
						start: '20041206T120000Z',
						end: '20041206T130000Z',
						rrule,
						summary: 'Weekly Meeting'
					},
					{
						dtStamp: '20041210T183838Z',
						uid: '2@example.com',
						start: '20041213T130000Z',
						end: '20041213T140000Z',
						summary: 'Weekly Meeting',
						recurrenceId: '20041213T120000Z'
					}
				]
			})
			const data = builder.build()
			expect(data).toEqual(file)
		})

		it('Test event with newlines', () => {

			const file = loadFile('events/newlines.ics')

			const builder = new Builder({
				version: '2.0',
				prodId: '-//Example Corp.//CalDAV Client//EN',
				events: [
					{
						dtStamp: '20041210T183904Z',
						uid: 'uid1@example.com',
						summary: 'Summary with \n\n multiple \n newlines',
						description: 'Description with \n newlines'
					}
				]
			})
			const data = builder.build()

			expect(data).toEqual(file)
		})

		it('Creates dtStamp when not set', () => {
			const builder = new Builder({
				version: '2.0',
				prodId: '-//Example Corp.//CalDAV Client//EN',
				events: [
					{
						uid: '1@example.com',
						start: '20041207T120000Z',
						end: '20041207T130000Z'
					}
				]
			})

			const data = builder.build()

			expect(data).toContain('DTSTAMP');
		})

		it('Fails with end and duration at the same time', () => {
			const builder = new Builder({
				version: '2.0',
				prodId: '-//Example Corp.//CalDAV Client//EN',
				events: [
					{
						dtStamp: '20041210T183904Z',
						uid: '1@example.com',
						start: '20041207T120000Z',
						end: '20041207T130000Z',
						duration: {
							weeks: 1
						},
						summary: 'Two-off Meeting'
					}
				]
			})

			expect(() => {builder.build()}).toThrow(BuildingError);
		})
	})

	describe('Test FreeBusy', () => {
		it('Create freebusy component', () => {
			const file = loadFile('freebusy/simple.ics')

			const builder = new Builder({
				version: '2.0',
				prodId: '-//Example Corp.//CalDAV Client//EN',
				freebusy: [
					{
						uid: '19970901T082949Z-FA43EF@example.com',
						attendees: [
							{
								address: 'john_public@example.com'
							}
						],
						organizer: {
							address: 'jane_doe@example.com'
						},
						start: '19971015T050000Z',
						end: '19971016T050000Z',
						dtStamp: '19970901T083000Z'
					}
				]
			})

			const data = builder.build()

			expect(data).toEqual(file)
		})
	})

	describe('Test TimeZone', () => {
		it('Create timezone component', () => {
			const file = loadFile('timezones/europe_bratislava.ics')

			const builder = new Builder({
				version: '2.0',
				prodId: '-//Touch4IT//CalDAV Client//EN',
				timezone: {
					tzId: 'Europe/Bratislava',
					tzUrl: 'http://tzurl.org/zoneinfo-outlook/Europe/Bratislava',
					xProps: [
						{
							name: 'lic-location',
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

			const data = builder.build()

			expect(data).toEqual(file)
		})

		it('Generate timezone component', () => {
			const file = loadFile('events/event_with_timezone.ics')

			const builder = new Builder({
				version: '2.0',
				prodId: '-//RDU Software//NONSGML HandCal//EN',
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

			
			const data = builder.build()
			console.log({file})
			console.log({data})

			expect(data).toEqual(file)
		})
	})
})
