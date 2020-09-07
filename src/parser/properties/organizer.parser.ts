import ParsingError from '../../exceptions/parser.error'
import { InputParameters } from '../../types/classes/parsers/property.parser'
import { Organizer } from '../../types/general'
import BaseParser from './base.parser'

const validParameters: InputParameters = {
	'CN': 'cn',
	'DIR': 'dir',
	'SENT-BY': 'sentBy',
	'SCHEDULE-STATUS': { name: 'scheduleStatus', lambda: (text: string): string | string[] => text.includes(',') ? text.split(',') : text }
}

class OrganizerParser extends BaseParser<Organizer> {
	public parse(value: string, params = ''): Organizer {
		if (!value) {
			throw new ParsingError('Empty iCalendar organizer value')
		}

		value = value.replace('mailto:', '')

		return {
			address: value,
			...this.parseParams('organizer', params, validParameters),
		}
	}
}

export default OrganizerParser
