import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { Attendee } from '../../types/general'
import BaseParser from './base.parser'

const validParameters: Parameters = {
	'CN': 'cn',
	'DIR': 'dir',
	'SENT-BY': 'sentBy',
	'CUTYPE': 'cu',
	'MEMBER': 'member',
	'ROLE': 'role',
	'PARTSTAT': 'partstat',
	'RSVP': 'rsvp',
	'DELEGATED-TO': { name: 'delegatedTo', lambda: (text: string): string => text.replace('mailto:', '') },
	'DELEGATED-FROM': { name: 'delegatedFrom', lambda: (text: string): string => text.replace('mailto:', '') },
	'SCHEDULE-STATUS': { name: 'scheduleStatus', lambda: (text: string): string | string[] => text.includes(',') ? text.split(',') : text }
}

class AttendeeParser extends BaseParser<Attendee> {
	public parse(value: string, params = ''): Attendee {
		if (!value) {
			throw new ParsingError('Empty iCalendar attendee value')
		}

		value = value.replace('mailto:', '')

		return {
			address: value,
			...this.parseParams('attendee', params, validParameters),
		}
	}
}

export default AttendeeParser
