import ParsingError from '../../exceptions/parser.error'
import BaseParser from './base.parser'

class StringParser extends BaseParser<string> {
    public parse(iCalValue: string, params: string = ''): string {
        if (!iCalValue || !iCalValue.length) {
            throw new ParsingError(`Invalid iCalendar string value: ${iCalValue}`)
        }
        return iCalValue
    }
}

export default StringParser
