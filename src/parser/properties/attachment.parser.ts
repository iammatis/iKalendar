import ParsingError from '../../exceptions/parser.error'
import { Attachment } from '../../types/general'
import BaseParser from './base.parser'

class AttachmentParser extends BaseParser<Attachment> {
    public parse(iCalValue: string): Attachment {
        if (iCalValue === '') {
            throw new ParsingError(`Invalid icalendar attachment value: '${iCalValue}'`)
        }

        if (!iCalValue.includes(':')) {
            return {value: iCalValue}
        } else {
            const [type, value] = iCalValue.split(':')

            if (!type || !value) {
                throw new ParsingError(`Invalid iCalendar attachment value: '${iCalValue}'`)
            }

            const [, typeValue] = type.split('=')

            if(!typeValue) {
                throw new ParsingError(`Invalid iCalendar attachment type value: '${iCalValue}'`)
            }

            return {type: typeValue, value}
        }
    }
}

export default AttachmentParser
