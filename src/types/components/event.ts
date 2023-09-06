import { Attachment, Attendee, Classification, ComplexDate, Duration, GeoPosition, Organizer, RecurrenceDate, Relation, Status, Transparency, XProp } from '../general'
import Alarm from './alarm'
import { RRule } from 'rrule'

type Event = {
    dtStamp?: string | ComplexDate
    uid: string
    start?: string | ComplexDate
    class?: Classification
    created?: string
    description?: string
    geo?: GeoPosition
    lastModified?: string
    location?: string
    organizer?: Organizer
    priority?: number
    sequnce?: number
    status?: Status
    summary?: string
    transp?: Transparency
    url?: string
    color?: string
    recurrenceId?: string
    rrule?: RRule
    end?: string | ComplexDate
    duration?: Duration
    attachments?: Attachment[]
    attendees?: Attendee[]
    categories?: string[]
    comment?: string
    contact?: string
    exdate?: string | ComplexDate
    relatedTo?: Relation[]
    resources?: string[]
    rdate?: RecurrenceDate
    xProps?: XProp[]
    alarms?: Alarm[]
}

export default Event
