import ParsingError from '../../exceptions/parser.error'
import BaseParser from './base.parser'

class StringArrayParser extends BaseParser<string[]> {
    public parse(iCalValue: string): string[] {
        if (!iCalValue || !iCalValue.length) {
            throw new ParsingError(`Invalid iCalendar string array value: ${iCalValue}`)
        }

        return iCalValue.split(',')
    }
}

export default StringArrayParser
