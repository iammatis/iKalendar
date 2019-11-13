import StringParser from './parser/properties/string.parser'
import Calendar from './types/calendar'
import IParser from './types/classes/iparser'

import { AttachmentParser, AttendeeParser, DateParser, DurationParser, GeoParser, NumberParser, OrganizerParser, RRuleParser, StringArrayParser, TriggerParser } from './parser/properties'

export class Parser implements IParser {
	public parse(object: string): Calendar {
		const lines = this.joinLongLines(this.splitLines(object))
		let calendar: Calendar

		for (const line of lines) {
			const [prop, value] = line.split(/[:;](.+)?/)
			if(!this.isValidProperty(prop)) {
				throw new Error('Invalid Property!')
			}

			const parser = this.getPropertyParser(prop)
			parser.parse(value)
		}

		return {}
	}

	private getPropertyParser(property: string) {
		switch (property) {
			case 'CALSCALE':
			case 'METHOD':
			case 'PRODID':
			case 'VERSION':
			case 'CLASS':
			case 'COMMENT':
			case 'DESCRIPTION':
			case 'LOCATION':
			case 'STATUS':
			case 'SUMMARY':
			case 'TRANSP':
			case 'TZID':
			case 'TZNAME':
			case 'TZURL':
			case 'CONTACT':
			case 'RECURRENCE-ID':
			case 'URL':
			case 'UID':
			case 'ACTION':
				return new StringParser()
			
			case 'ATTACH':
				return new AttachmentParser()

			case 'CATEGORIES':
			case 'RESOURCES':
				return new StringArrayParser()

			case 'GEO':
				return new GeoParser()

			case 'PERCENT-COMPLETE':
			case 'PRIORITY':
			case 'SEQUENCE':
				return new NumberParser()	

			case 'COMPLETED':
			case 'DTEND':
			case 'DUE':
			case 'DTSTART':
			case 'EXDATE':
			case 'CREATED':
			case 'DTSTAMP':
			case 'LAST-MODIFIED':
				return new DateParser()

			case 'DURATION':
				return new DurationParser()

			case 'FREEBUSY':
				return new DurationParser()

			case 'TZOFFSETFROM':
			case 'TZOFFSETTO':
					return new DurationParser()

			case 'ATTENDEE':
					return new AttendeeParser()

			case 'ORGANIZER':
					return new OrganizerParser()

			case 'RRULE':
					return new RRuleParser()

			case 'TRIGGER':
					return new TriggerParser()
		
			default:
				throw new Error('')
		}
	}

	private isValidProperty(property: string): boolean {
		const validProps = ['CALSCALE', 'METHOD', 'PRODID', 'VERSION', 'ATTACH', 'CATEGORIES', 'CLASS', 'COMMENT', 'DESCRIPTION', ' GEO', 'LOCATION', 'PERCENT-COMPLETE', 'PRIORITY', 'RESOURCES', 'STATUS', 'SUMMARY', 'COMPLETED', 'DTEND', 'DUE', ' DTSTART', 'DURATION', 'FREEBUSY', 'TRANSP', 'TZID', 'TZNAME', 'TZOFFSETFROM', 'TZOFFSETTO', 'TZURL', 'ATTENDEE', 'CONTACT', 'ORGANIZER', 'RECURRENCE-ID', 'RELATED-TO', 'URL', 'UID', 'EXDATE', 'EXRULE', 'RDATE', 'RRULE', 'ACTION', 'REPEAT', 'TRIGGER', 'CREATED', 'DTSTAMP', 'LAST-MODIFIED', 'SEQUENCE', 'REQUEST-STATUS']
		return property in validProps
	}

	private splitLines(object: string): string[] {
		return object
			.replace(/\r\n\s/g, '')
			.replace(/\\n/g, ' ')
			.replace(/  +/g, ' ')
			.replace(/\\/g, '')
			.split('\n')
	}

	private joinLongLines(lines: string[]): string[] {
		const res = []
		let index = 0

		for (const line of lines) {
			if (line[0] === ' ') {
				if (index - 1 < 0) {
					throw new Error('Invalid object!')
				}
				res[index - 1] += line.substr(1)
			} else {
				res.push(line)
			}
			index++
		}

		return res
	}
}
