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
						dtStamp: '2010-12-31T08:30:00.000Z',
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
						dtStamp: '2010-12-31T08:30:00.000Z',
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
						dtStamp: '2004-12-10T18:39:04.000Z',
						uid: '1@example.com',
						start: '2004-12-07T12:00:00.000Z',
						end: '2004-12-07T13:00:00.000Z',
						summary: 'One-off Meeting'
					},
					{
						dtStamp: '2004-12-10T18:38:38.000Z',
						uid: '2@example.com',
						start: '2004-12-06T12:00:00.000Z',
						end: '2004-12-06T13:00:00.000Z',
						rrule,
						summary: 'Weekly Meeting'
					},
					{
						dtStamp: '2004-12-10T18:38:38.000Z',
						uid: '2@example.com',
						start: '2004-12-13T13:00:00.000Z',
						end: '2004-12-13T14:00:00.000Z',
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
						dtStamp: '2004-12-10T18:39:04.000Z',
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
})
