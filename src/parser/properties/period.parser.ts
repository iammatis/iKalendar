import ParsingError from '../../exceptions/parser.error'
import { Period } from '../../types/general'
import BaseParser from './base.parser'
import DurationParser from './duration.parser'

class PeriodParser extends BaseParser<Period> {
	public parse(iCalValue: string, params = ''): Period {
		if (!iCalValue) {
			throw new ParsingError('Empty iCalendar period value')
		}
        
		const [ periodExplicit, periodStart ] = iCalValue.split('/')
        
		let duration;
		if (periodStart.includes('P')) { // Duration
			const durationParser = new DurationParser()
			duration = durationParser.parse(periodStart)
		}
        
		const end = duration ? { duration } : { end: periodStart }

		return {
			start: periodExplicit,
			...end
		}
	}
}

export default PeriodParser
