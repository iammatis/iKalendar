import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { ComplexDate } from '../../types/general'
import BaseParser from './base.parser'

const validParameters: Parameters = {
	'TYPE': 'type',
	'TZID': 'tzId'
}

class DateParser extends BaseParser<string | ComplexDate> {
    public parse(iCalValue: string): string | ComplexDate {
        if (!iCalValue) {
            throw new ParsingError('Empty iCalendar date value')
        }

        if (!iCalValue.includes(':')) {
            return iCalValue
        } else {
            const [params, value] = iCalValue.split(':')

            if (!params || !value) {
                throw new ParsingError(`Invalid iCalendar date value: '${iCalValue}'`)
            }

            
            const optionals = this.parseParams(params, validParameters)

            return {
                value,
                ...optionals,
            }
        }
    }
}

export default DateParser
