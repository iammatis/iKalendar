import ParsingError from '../../exceptions/parser.error'
import { InputParameters } from '../../types/classes/parsers/property.parser'
import { ComplexDate } from '../../types/general'
import BaseParser from './base.parser'
import dayjs = require('dayjs')
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const validParameters: InputParameters = {
	'VALUE': 'type',
	'TZID': 'tzId'
}

class DateParser extends BaseParser<string | ComplexDate> {
	public parse(value: string, params = ''): string | ComplexDate {
		if (!value) {
			throw new ParsingError('Empty iCalendar date value')
		}

		const parameters = this.parseParams('date', params, validParameters)
		if (!Object.entries(parameters).length) {
			return dayjs.utc(value.split('Z').shift()).toISOString() 
		} else {
			const { tzId = '' } = parameters;
			const date = dayjs(value.split('Z').shift())

			return {
				...parameters,
				value: (tzId ? date.tz(tzId) : date).toISOString()
			}
		}
	}
}

export default DateParser
