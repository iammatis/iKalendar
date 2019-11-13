import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { Duration, Trigger } from '../../types/general'
import BaseParser from './base.parser'
import DurationParser from './duration.parser'

const validParameters: Parameters = {
	'VALUE': 'type',
	'RELATED': 'related'
}

class TriggerParser extends BaseParser<Trigger> {
    public parse(iCalValue: string): Trigger {
        if (!iCalValue) {
            throw new ParsingError('Empty iCalendar trigger value')
        }

        let temp = iCalValue
        let params = ''
        let optionals: Parameters = {}
        if (iCalValue.includes(':')) { // With Parameters
            [params, temp] = iCalValue.split(':')

            optionals = this.parseParams(params, validParameters)
        }

        let value: (string | Duration) = temp
        if (temp.includes('P')) { // Duration
            const durationParser = new DurationParser()
            value = durationParser.parse(temp)
        }

        return {
            value,
            ...optionals
        }
    }
}

export default TriggerParser
