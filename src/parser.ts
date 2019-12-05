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
import { Calendar, XProp } from './types'
import IParser from './types/classes/iparser'

type DecomposedLine = {
	name: string
	params: string
	value: string
}

export class Parser implements IParser {
	public parse(object: string): Calendar {
		const lines = this.joinLongLines(this.splitLines(object.trim()))
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

	private getPropertyParser(property: string): any {
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
					throw new ParsingError('Invalid object! Couldn\'t join long lines.')
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

