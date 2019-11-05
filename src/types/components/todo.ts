import { Classification, GeoPosition, Organizer, Duration, Attachment, Attendee, XProp, Status, Relation } from "../general";
import { Alarm } from "./alarm";

export type Todo = {
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
    rrule?: string
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
    rDate?: Date
    xProps?: XProp[]
    alarm?: Alarm[]
}
