import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { Organizer } from '../../types/general'
import BaseParser from './base.parser'

const validParameters: Parameters = {
	'CN': 'cn',
	'DIR': 'dir',
	'SENT-BY': 'sentBy'
}

class OrganizerParser extends BaseParser<Organizer> {
    public parse(value: string, params: string = ''): Organizer {
        if (!value) {
            throw new ParsingError('Empty iCalendar organizer value')
        }

        return {
			address: value,
			...this.parseParams('organizer', params, validParameters),
		}
    }
}

export default OrganizerParser
