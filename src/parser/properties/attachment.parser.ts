import ParsingError from '../../exceptions/parser.error'
import { Attachment } from '../../types/general'
import BaseParser from './base.parser'

const validParameters = {
	'VALUE': 'type'
}

class AttachmentParser extends BaseParser<Attachment> {
	public parse(value: string, params = ''): Attachment {
		if (!value) {
			throw new ParsingError(`Invalid icalendar attachment value: '${value}'`)
		}

		return {
			value,
			...this.parseParams('attachment', params, validParameters)
		}
	}
}

export default AttachmentParser
