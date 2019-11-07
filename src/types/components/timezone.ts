import { RecurrenceDate, XProp } from '../general'

type TimeZone = {
    tzid: string
    lastModified?: Date
    tzUrl?: string
    type: 'STANDARD' | 'DAYLIGHT'
    start: Date
    offsetTo: string
    offsetFrom: string
    rrule?: string
    comment?: string
    rDate?: RecurrenceDate
    tzName?: string
    xProps?: XProp[]
}

export default TimeZone
