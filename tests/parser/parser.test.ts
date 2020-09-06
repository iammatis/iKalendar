import { readFileSync } from 'fs'
import { join } from 'path'

import { Parser } from '../../src/parser'

let parser: Parser

const loadFile = (name: string): string => readFileSync(join(__dirname, `../fixtures/${name}`), 'utf-8')

describe('Test Parser', () => {

	beforeAll(() => {
		parser = new Parser()
	})

	it('Test fail - empty string', () => {
		expect(() => {
			parser.parse('')
		}).toThrow()
	})

	it('Parse simple iCal file', () => {
		const iCal = loadFile('events/multiple_attendees.ics')
		const calendar = parser.parse(iCal)

		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
			events: [
				{
					dtStamp: '20101231T083000Z',
					uid: 'uid1@example.com',
					attendees: [
						{
							cn: 'Henry Cabot',
							role: 'REQ-PARTICIPANT',
							address: 'hcabot@example.com',
							scheduleStatus: '2.0'
						},
						{
							cn: 'Jane Doe',
							role: 'REQ-PARTICIPANT',
							partstat: 'ACCEPTED',
							delegatedFrom: 'mailto:bob@example.com',
							address: 'ildoit@example.com',
							scheduleStatus: [ '2.0', '2.4' ]
						}
					],
					xProps: [
						{
							name: 'TESTNAME',
							value: 'random xprop value'
						}
					]
				}
			]
		})
	})

	it('Parse iCal file with newlines', () => {
		const iCal = loadFile('events/newlines.ics')
		const calendar = parser.parse(iCal)

		expect(calendar).toEqual({
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
	})

	it('Parse iCal file from expanded query', () => {
		const iCal = loadFile('events/expanded_event.ics')
		const calendar = parser.parse(iCal)

		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Touch4IT//CalDAV Client//EN',
			events: [
				{
					dtStamp: '20200317T164533Z',
					start: '20200323T091500Z',
					uid: '12345678910111',
					description: 'Rezervacka produktu',
					duration: {
						isNegative: false,
						minutes: 30
					},
					xProps: [
						{
							name: 'PRODUCT',
							value: '5dcd0a1eece9e263de1e6ccb'
						}
					]
				}
			]
		})
	})

	it('Parse string instead of iCal file', () => {
		const iCal = 'BEGIN:VCALENDAR\r\n' +
		'VERSION:2.0\r\n' +
		'PRODID:-//Sabre//Sabre VObject 4.2.0//EN\r\n' +
		'CALSCALE:GREGORIAN\r\n' +
		'BEGIN:VEVENT\r\n' +
		'UID:12345678910111\r\n' +
		'DTSTART:20200323T091500Z\r\n' +
		'DESCRIPTION:Rezervacka produktu\r\n' +
		'DURATION:PT30M\r\n' +
		'X-PRODUCT:5dcd0a1eece9e263de1e6ccb\r\n' +
		'DTSTAMP:20200317T164533Z\r\n' +
		'END:VEVENT\r\n' +
		'END:VCALENDAR\r\n'

		const calendar = parser.parse(iCal)

		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Sabre//Sabre VObject 4.2.0//EN',
			calscale: 'GREGORIAN',
			events: [
				{
					dtStamp: '20200317T164533Z',
					start: '20200323T091500Z',
					uid: '12345678910111',
					description: 'Rezervacka produktu',
					duration: {
						isNegative: false,
						minutes: 30
					},
					xProps: [
						{
							name: 'PRODUCT',
							value: '5dcd0a1eece9e263de1e6ccb'
						}
					]
				}
			]
		})
	})

})
