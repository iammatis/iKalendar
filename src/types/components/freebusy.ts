import { Organizer, Attendee, XProp, FreeBusyType, Period } from "../general";

export type FreeBusy = {
    dtStamp?: Date
    uid?: string
    contact?: string
    start?: Date
    end?: Date
    organizer?: Organizer
    url?: string
    attendees?: Attendee[]
    comment?: string
    freebusy?: { type?: FreeBusyType; value: Period[] }
    rStatus?: string
    xProps?: XProp[]
}
