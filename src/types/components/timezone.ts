import { XProp, RDTType, Period } from "../general";

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
    rDate?: { type?: RDTType; value: (Date | Period)[]; tzId?: string; }
    tzName?: string
    xProps?: XProp[]
}

export default TimeZone
