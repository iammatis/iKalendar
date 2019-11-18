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
    public parse(value: string, params: string = ''): Trigger {
        if (!value) {
            throw new ParsingError('Empty iCalendar trigger value')
        }

        let triggerValue: (string | Duration) = value
        if (value.includes('P')) { // Duration
            const durationParser = new DurationParser()
            triggerValue = durationParser.parse(value)
        }

        return {
			value: triggerValue,
			...this.parseParams('trigger', params, validParameters),
		}
    }
}

export default TriggerParser
