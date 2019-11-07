import { GeoPosition, Organizer, Duration, Attachment, Attendee, Relation, XProp, Trigger, RecurrenceDate } from "../general";
import { Todo, Journal, FreeBusy, TimeZone, Alarm, Event } from "../components";

interface BuilderInterface {
    array: string[]

    build(): string

    append(value: string): void

    appendString(attrName: string, value?: string): void
    appendStrings(attrName: string, values?: string[]): void

    appendNumber(attrName: string, value?: number): void

    appendDate(attrName: string, date?: string): void

    appendRDate(rDate?: RecurrenceDate): void

    appendGeoPosition(geo?: GeoPosition): void

    appendOrganizer(organizer?: Organizer): void

    appendDuration(duration?: Duration): void

    appendAttachment(attachment?: Attachment): void
    appendAttachments(attachments?: Attachment[]): void

    appendAttendee(attendee?: Attendee): void
    appendAttendees(attendees?: Attendee[]): void

    appendRelation(relation?: Relation): void
    appendRelations(relations?: Relation[]): void

    appendTrigger(trigger?: Trigger): void

    appendXprop(xProp?: XProp): void
    appendXprops(xProps?: XProp[]): void

    // Components

    appendEvent(event?: Event): void
    appendEvents(events?: Event[]): void

    appendTodo(todo?: Todo): void
    appendTodos(todo?: Todo[]): void

    appendJournal(journal?: Journal): void
    appendJournals(journals?: Journal[]): void

    appendFreeBusy(freebusy?: FreeBusy): void
    appendFreeBusys(freebusy?: FreeBusy[]): void

    appendTimeZone(timeZone?: TimeZone): void
    appendTimeZones(timeZones?: TimeZone[]): void

    appendAlarm(alarm?: Alarm): void
    appendAlarms(alarms?: Alarm[]): void

    formatDuration(duration: Duration): string
}

export default BuilderInterface
