import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { ComplexDate } from '../../types/general'
import BaseParser from './base.parser'

const validParameters: Parameters = {
	'VALUE': 'type',
	'TZID': 'tzId'
}

class DateParser extends BaseParser<string | ComplexDate> {
	public parse(value: string, params = ''): string | ComplexDate {
		if (!value) {
			throw new ParsingError('Empty iCalendar date value')
		}

		const paramsParsed = this.parseParams('date', params, validParameters)
		if (Object.entries(paramsParsed).length === 0) {
			return value
		} else {
			return {
				value,
				...paramsParsed
			}
		}
	}
}

export default DateParser
