import { RecurrenceDate, XProp } from '../general'
import { RRule } from 'rrule'

type TimeZone = {
    tzid: string
    lastModified?: Date
    tzUrl?: string
    type: 'STANDARD' | 'DAYLIGHT'
    start: Date
    offsetTo: string
    offsetFrom: string
    rrule?: RRule
    comment?: string
    rDate?: RecurrenceDate
    tzName?: string
    xProps?: XProp[]
}

export default TimeZone
