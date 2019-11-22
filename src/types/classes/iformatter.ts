import { Attachment, Attendee, Duration, GeoPosition, Organizer, RecurrenceDate, Relation, Trigger, XProp } from '../general'

interface IFormatter {
    formatString(attrName: string, value?: string): string
    formatStrings(attrName: string, values?: string[]): string

    formatDate(attrName: string, date?: string): string
    formatRDate(date?: RecurrenceDate): string

    formatGeo(geo?: GeoPosition): string

    formatOrganizer(organizer?: Organizer): string

    formatDuration(duration?: Duration): string

    formatAttachment(attachment?: Attachment): string
    formatAttachments(attachments: Attachment[]): string

    formatAttendee(attendee?: Attendee): string
    formatAttendees(attendees: Attendee[]): string

    formatRelation(relation?: Relation): string
    formatRelations(relations: Relation[]): string

    formatTrigger(trigger?: Trigger): string

    formatXprop(xProp?: XProp): string
    formatXprops(xProps: XProp[]): string
}

export default IFormatter
