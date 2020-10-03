import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { FreeBusyProperty } from '../../types/general'
import BaseParser from './base.parser'
import PeriodParser from './period.parser'

const validParameters: Parameters = {
	'FBTYPE': 'type'
}

class FreeBusyParser extends BaseParser<FreeBusyProperty> {
	public parse(iCalValue: string, params = ''): FreeBusyProperty {
		if (!iCalValue) {
			throw new ParsingError('Empty iCalendar free-busy value')
		}

		const paramsParsed = this.parseParams('date', params, validParameters)

		const periodParser = new PeriodParser()

		const value = iCalValue.split(',').map(period => periodParser.parse(period))

		return {
			...paramsParsed,
			value
		}
	}
}

export default FreeBusyParser
