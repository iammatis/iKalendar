import { Attendee, ComplexDate, FreeBusyProperty, Organizer, XProp } from '../general'

type FreeBusy = {
    dtStamp?: string | ComplexDate
    uid?: string
    contact?: string
    start?: string | ComplexDate
    end?: string | ComplexDate
    organizer?: Organizer
    url?: string
    attendees?: Attendee[]
    comment?: string
    freebusy?: FreeBusyProperty[]
    rStatus?: string
    xProps?: XProp[]
}

export default FreeBusy
