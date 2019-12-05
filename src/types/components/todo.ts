import { Attachment, Attendee, Classification, Duration, GeoPosition, Organizer, RecurrenceDate, Relation, Status, XProp } from '../general'
import Alarm from './alarm'
import { RRule } from 'rrule'

type Todo = {
    dtStamp: Date
    uid: string
    class?: Classification
    completed?: Date
    description?: string
    start?: Date
    geo?: GeoPosition
    lastModified?: Date
    location?: string
    organizer?: Organizer
    percentComplete?: number
    priority?: number
    recurId?: string
    sequence?: number
    status?: Status
    summary?: number
    url?: string
    rrule?: RRule
    due?: Date
    duration?: Duration
    attachments?: Attachment[]
    attendees?: Attendee[]
    categories?: string[]
    comment?: string
    contact?: string
    exDate?: Date
    rStatus?: string
    relatedTo?: Relation[]
    resources?: string[]
    rDate?: RecurrenceDate
    xProps?: XProp[]
    alarm?: Alarm[]
}

export default Todo
