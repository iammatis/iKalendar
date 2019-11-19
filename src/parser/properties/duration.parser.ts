import ParsingError from '../../exceptions/parser.error'
import { Parameters } from '../../types/classes/parsers/property.parser'
import { Duration } from '../../types/general'
import BaseParser from './base.parser'

const parameters: Parameters = {
    'W': 'weeks',
    'H': 'hours',
    'M': 'minutes',
    'S': 'seconds',
    'D': 'days'
}

class DurationParser extends BaseParser<Duration> {
    public parse(iCalValue: string, params: string = ''): Duration {

        const isNegative = iCalValue[0] === '-'

        if ((isNegative && iCalValue[1] === 'P') || (!isNegative && iCalValue[0] === 'P')) {
            const index = isNegative ? 2 : 1
            const duration = iCalValue.substr(index)
            return {isNegative, ...this.parseTypes(duration)}

        } else {
            throw new ParsingError(`Invalid iCalendar duration value: '${iCalValue}'`)
        }
    }

    private parseTypes(duration: string): Parameters<number> {
        const result: Parameters<number> = {}
        const matches = duration.match(/\d*(W|D|H|M|S)/g)

        if (!matches) {
            throw new ParsingError(`Invalid iCalendar duration '${duration}'`)
        }

        for (const match of matches) {
            const matchArr = match.match(/(\d+)(W|D|M|H|S)/)
            if (!matchArr || !matchArr[2]) {
                throw new ParsingError(`Invalid iCalendar duration '${duration}'`)
            }

            const [, value, dur] = matchArr
            if (!(dur in parameters)) {
                throw new ParsingError(`Invalid iCalendar duration\'s parameter '${dur}'`)
            }

            const type = parameters[dur]
            const amount = Number(value)
            if (isNaN(amount)) {
                throw new ParsingError(`Invalid iCalendar duration '${duration}'`)
            }

            result[type] = amount
        }

        return result
    }
}

export default DurationParser
