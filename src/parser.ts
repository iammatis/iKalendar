import { arrayAttributes, componentsRegistry, propertiesRegistry } from './constants'
import ParsingError from './exceptions/parser.error'
import {
	AttachmentParser,
	AttendeeParser,
	DateParser,
	DurationParser,
	GeoParser,
	NumberParser,
	OrganizerParser,
	RRuleParser,
	StringArrayParser,
	TriggerParser,
} from './parser/properties'
import StringParser from './parser/properties/string.parser'
import Calendar from './types/calendar'
import IParser from './types/classes/iparser'
import { XProp } from './types/general'

import util = require('util')

type DecomposedLine = {
	name: string
	params: string
	value: string
}

export class Parser implements IParser {
	public parse(object: string): Calendar {
		const lines = this.joinLongLines(this.splitLines(object))
		return this.recursion(lines)
	}

	private recursion(component: string[]): any {
		const componentObject: Record<string, any> = {}
		let index = 0
		let subComponentIndex = null
		let subComponentName = ''

		for (const line of component) {
			if (!subComponentIndex) {
				const decomposedLine = this.decomposeLine(line)
				let { name } = decomposedLine
				const { value, params } = decomposedLine

				if (name === 'BEGIN') {
					subComponentIndex = index
					subComponentName = value
				} else if (name === 'END') {
					continue
				} else {
					// Parse value
					let parsedVal
					if (/^X-/.test(name)) {
						const xProp: XProp = { name: name.substr(2), value }
						parsedVal = xProp
						name = 'X-PROPS'
					} else {
						const propertyParser = this.getPropertyParser(name)
						parsedVal = propertyParser.parse(value, params)
					}

					const calName = name in propertiesRegistry ?  propertiesRegistry[name] : ''
					if (!calName) {
						throw new ParsingError(`No such property '${name}'`)
					}

					this.addValue(componentObject, calName, parsedVal)
				}
			} else {
				if (line === `END:${subComponentName}`) {
					const subComponent = component.slice(subComponentIndex + 1, index)

					const compName = subComponentName in componentsRegistry ?  componentsRegistry[subComponentName] : ''
					if (!compName) {
						throw new ParsingError(`No such component '${subComponentName}'`)
					}

					this.addValue(componentObject, compName, this.recursion(subComponent))

					subComponentName = ''
					subComponentIndex = null
				}
			}
			index++
		}

		return componentObject
	}

	private addValue(object: Record<string, any>, name: string, value: any): void {
		// Create an array and push into it
		if (arrayAttributes.includes(name)) {
			(object[name] = object[name] || []).push(value)

		// Simple property (aka not an array)
		} else {
			object[name] = value
		}
	}

	private decomposeLine(line: string): DecomposedLine {
		const NAME = '[-a-zA-Z0-9]+'
		const QSTR = '"[^"]*"'
		const PTEXT = '[^";:,]*'
		const PVALUE = `(?:${QSTR}|${PTEXT})`
		const PARAM = `(${NAME})=(${PVALUE}(?:,${PVALUE})*)`
		const VALUE = '.*'
		const LINE = `(?<name>${NAME})(?<params>(?:;${PARAM})*):(?<value>${VALUE})`
		const BAD_LINE = `(?<name>${NAME})(?<params>(?:;${PARAM})*)`

		const match = line.match(LINE)
		if (match && match.groups) {
			const { groups } = match
			return {
				name: groups.name,
				params: groups.params,
				// params: groups.params.split(';'),
				value: groups.value
			}
		} else {
			throw new Error(`Invalid iCalendar line: ${line}`)
		}
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
				throw new ParsingError(`Invalid Property '${property}'`)
		}
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
			if (line[0] === ' ' || line[0] === '\t') {
				if (index - 1 < 0) {
					throw new Error('Invalid object!')
				}

				res[index - 1] += line.substr(1)
			} else {
				res.push(line)
				index++
			}
		}

		return res
	}
}

const str = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
VERSION:2.0
X-WR-CALNAME:testing trigger
METHOD:PUBLISH
PRODID:-//Apple Inc.//Mac OS X 10.15.1//EN
BEGIN:VEVENT
UID:64667D10-67A5-421B-AC55-A7082CD8DDA1
TRANSP:TRANSPARENT
CREATED:20191112T143857Z
ATTENDEE;CN="Lukáš Láni";CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=RE
 Q-PARTICIPANT:mailto:lukas.lani@touch4it.com
ATTENDEE;CN="Matej Belluš";CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;ROLE=REQ-
 PARTICIPANT:mailto:matej.bellus@touch4it.com
ATTENDEE;CN="Meeting Room 1 - Jednotka,  Holubyho 4, Bratislava";CUTYPE=
 INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT:mailto:meetingroom
 1@touch4it.com
ATTENDEE;CN="Meeting Room 5 - Power Room - Holubyho 4, Bratislava";CUTYP
 E=INDIVIDUAL;PARTSTAT=DECLINED;ROLE=REQ-PARTICIPANT:mailto:powerroom@tou
 ch4it.com
ATTENDEE;CN="Tomas Tibensky";CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;ROLE=RE
 Q-PARTICIPANT:mailto:tomas.tibensky@touch4it.com
ATTENDEE;CN="Viktor Šulák";CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;ROLE=REQ-
 PARTICIPANT:mailto:sulak@touch4it.com
DTEND;VALUE=DATE:20191117
X-APPLE-TRAVEL-ADVISORY-BEHAVIOR:AUTOMATIC
SUMMARY:testing trigger
LAST-MODIFIED:20191112T144041Z
DTSTAMP:20191112T144044Z
DTSTART;VALUE=DATE:20191116
SEQUENCE:0
BEGIN:VALARM
UID:BC6AA6FD-E8ED-4206-B8B3-CFED559829B7
X-APPLE-LOCAL-DEFAULT-ALARM:TRUE
TRIGGER;VALUE=DATE-TIME:19760401T005545Z
ACTION:NONE
X-WR-ALARMUID:BC6AA6FD-E8ED-4206-B8B3-CFED559829B7
END:VALARM
BEGIN:VALARM
UID:77CB14FE-4887-4C49-844C-2FF7ECCF855B
X-APPLE-DEFAULT-ALARM:TRUE
TRIGGER:-PT15H
ACTION:AUDIO
ATTACH;VALUE=URI:Chord
X-WR-ALARMUID:77CB14FE-4887-4C49-844C-2FF7ECCF855B
END:VALARM
BEGIN:VALARM
UID:C1B7F45A-A24E-4DBC-A56D-E891D946DA7A
ACTION:AUDIO
TRIGGER:-P6DT15H
ATTACH;VALUE=URI:Chord
X-WR-ALARMUID:C1B7F45A-A24E-4DBC-A56D-E891D946DA7A
END:VALARM
END:VEVENT
END:VCALENDAR`

const parser = new Parser()
// console.log(parser.parse(str))

// alternative shortcut
const cal: Calendar = parser.parse(str)
console.log(util.inspect(cal, false, null, true))

console.log('cal.calscale')
console.log(cal.calscale)

console.log(util.inspect(cal.events, false, null, true))

