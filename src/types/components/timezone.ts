import { ComplexDate, RecurrenceDate, XProp } from '../general'
import { RRule } from 'rrule'

type TimeZone = {
    tzid: string
    lastModified?: string
    tzUrl?: string
    standard?: TzProp[]
    daylight?: TzProp[]
    xProps?: XProp[]
}

type TzProp = {
    start: string | ComplexDate
    offsetTo: string
    offsetFrom: string
    rrule?: RRule
    comment?: string
    rDate?: RecurrenceDate
    tzName?: string
    xProps?: XProp[]
}

export {
	TimeZone,
	TzProp
}
    
