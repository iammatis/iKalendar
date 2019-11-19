import ParsingError from '../../exceptions/parser.error'
import BaseParser from './base.parser'

class NumberParser extends BaseParser<number> {
    public parse(iCalValue: string, params: string = ''): number {
        if (!iCalValue) {
            throw new ParsingError('Empty iCalendar number value')
        }

        const value = Number(iCalValue)

        if (isNaN(value)) {
            throw new ParsingError(`Invalid iCalendar number value: ${iCalValue}`)
        }

        return value
    }
}

export default NumberParser
