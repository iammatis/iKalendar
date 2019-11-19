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
	'DELEGATED-TO': 'delegatedTo',
	'DELEGATED-FROM': 'delegatedFrom',
}

class AttendeeParser extends BaseParser<Attendee> {
	public parse(value: string, params: string = ''): Attendee {
        if (!value) {
            throw new ParsingError('Empty iCalendar attendee value')
        }

		return {
			address: value,
			...this.parseParams('attendee', params, validParameters),
		}
	}
}

export default AttendeeParser
