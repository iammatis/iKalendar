import { Parser } from '../../../src/parser'
import { loadFile } from '../../utils'

let parser: Parser


describe('Test FreeBusy Component Parsing', () => {

	beforeAll(() => {
		parser = new Parser()
	})

	it('Test simple freebusy', () => {
		const iCal = loadFile('freebusy/simple.ics')
		const calendar = parser.parse(iCal)
        
		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Example Corp.//CalDAV Client//EN',
			freebusy: [
				{
					dtStamp: '19970901T083000Z',
					start: '19971015T050000Z',
					end: '19971016T050000Z',
					uid: '19970901T082949Z-FA43EF@example.com',
					attendees: [
						{
							address: 'john_public@example.com'
						}
					],
					organizer: {
						address: 'jane_doe@example.com'
					}
				}
			]
		})
	})

	it('Test complex freebusy', () => {
		const iCal = loadFile('freebusy/multiple_freebusy.ics')
		const calendar = parser.parse(iCal)
        
		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Example Corp.//CalDAV Client//EN',
			freebusy: [
				{
					start: '19980313T141711Z',
					end: '19980410T141711Z',
					url: 'http://www.example.com/calendar/busytime/jsmith.ifb',
					organizer: {
						address: 'jsmith@example.com'
					},
					freebusy: [
						{
							type: 'BUSY-TENTATIVE',
							value: [ {
								start: '19980314T233000Z',
								end: '19980315T003000Z'
							} ]
						},
						{
							value: [ {
								start: '19980316T153000Z',
								end: '19980316T163000Z'
							} ]
						},
						{
							value: [ {
								start: '19980318T030000Z',
								end: '19980318T040000Z'
							} ]
						}
					]
				}
			]
		})
	})

	it('Test multiple freebusy components', () => {
		const iCal = loadFile('freebusy/multiple_components.ics')
		const calendar = parser.parse(iCal)
        
		expect(calendar).toEqual({
			version: '2.0',
			prodId: '-//Example Corp.//CalDAV Client//EN',
			freebusy: [
				{
					dtStamp: '19970901T083000Z',
					start: '19971015T050000Z',
					end: '19971016T050000Z',
					uid: '1@example.com',
					attendees: [
						{
							address: 'john_public@example.com'
						}
					],
					organizer: {
						address: 'jane_doe@example.com'
					}
				},
				{
					dtStamp: '19980901T083000Z',
					start: '19981015T050000Z',
					end: '19981016T050000Z',
					uid: '2@example.com',
					attendees: [
						{
							address: 'john_public@example.com'
						}
					],
					organizer: {
						address: 'jane_doe@example.com'
					}
				}
			]
		})
	})

})
