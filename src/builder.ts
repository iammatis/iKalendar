import * as moment from 'moment'
import BuilderInterface from "./types/classes/builder"
import { Alarm, Event, FreeBusy, Journal, TimeZone, Todo } from "./types/components"
import { Attachment, Attendee, ComplexDate, Duration, GeoPosition, Organizer, RecurrenceDate, Relation, Trigger, XProp } from "./types/general"

class Builder implements BuilderInterface {
    public array: string[]

    constructor() {
        this.array = []
    }

    public build(): string {
        return this.array.join('\r\n')
    }

    public append(value: string): void {
        if (value !== '') {
            this.array.push(value)
        }
    }

    public appendString(attrName: string, value?: string): void {
        this.append(value ? `${attrName}:${value}` : '')
    }
    
    public appendStrings(attrName: string, values?: string[], sep: string = ','): void {
        this.append(values && values.length ? `${attrName}:${values.filter(Boolean).join(sep)}` : '')
    }

    public appendNumber(attrName: string, value?: number): void {
        this.append(value !== undefined ? `${attrName}:${value}` : '')
    }
    
    public appendDate(attrName: string, date?: string | ComplexDate): void {
        if (date) {
            if (typeof date === 'string') {
                this.append(`${attrName}:${moment(date).format('YYYYMMDDTHHmmss')}`)
            } else {
                const { value, type, tzId } = date
                
                if (type && type === 'DATE') {
                    const typeValue = `VALUE=DATE`
                    const tz = tzId ? `;TZID=${tzId}` : ''
                    const momentDate = moment(value).format('YYYYMMDD')
                    this.append(`${attrName};${typeValue}${tz}:${momentDate}`)
                } else {
                    const tz = tzId ? `;TZID=${tzId}` : ''
                    const momentDate = moment(value).format('YYYYMMDDTHHmmss')
                    this.append(`${attrName}${tz}:${momentDate}`)
                }
            }
        }
    }

    public appendRDate(rDate?: RecurrenceDate): void {
        if (rDate) {
            const { type, tzId, dates, periods } = rDate
            const tzIdValue = tzId ? `;TZID=${tzId}` : ''
            let typeValue = ''
            let values = ''

            switch (type) {
                case 'DATE':
                    typeValue = ';VALUE=DATE'
                    values = dates ? dates.map(date => moment(date).format('YYYYMMDD')).join(',') : ''
                    break

                case 'PERIOD':
                    typeValue = ';VALUE=PERIOD'
                    values = periods ? periods.map(period => {
                        const { start, end, duration } = period
                        const startValue = moment(start).format('YYYYMMDDTHHmmss')
                        const endValue = end ? moment(end).format('YYYYMMDDTHHmmss') : this.formatDuration(duration!)
                        return `${startValue}/${endValue}`
                    }).join(',') : ''
                    break
            
                default: // DATE-TIME
                    values = dates ? dates.map(date => moment(date).format('YYYYMMDDTHHmmss')).join(',') : ''
                    break
            }

            this.append(`RDATE${tzIdValue}${typeValue}:${values}`)
        }
    }
    
    public appendGeoPosition(geo?: GeoPosition): void {
        this.append(geo ? `GEO:${geo.lat};${geo.lon}` : '')
    }
    
    public appendOrganizer(organizer?: Organizer): void {
        if (organizer) {
            const { address, cn, dir, sentBy } = organizer
            const optionals = [
                cn ? `CN=${cn}` : '',
                dir ? `DIR=${dir}` : '',
                sentBy ? `CN=${sentBy}` : ''
            ].filter(Boolean).join(';')

            this.append(optionals
                ? `ORGANIZER;${optionals}:${address}`
                : `ORGANIZER:${address}`)
        }
    }
    
    public appendDuration(duration?: Duration): void {
        if (duration) {
            this.appendString('DURATION', this.formatDuration(duration))
        }
    }
    
    public appendAttachment(attachment?: Attachment): void {
        if (attachment) {
            this.append(attachment.type
                ? `ATTACH;FMPTYPE=${attachment.type}:${attachment.value}`
                : `ATTACH:${attachment.value}`)
        }
    }
    
    public appendAttachments(attachments: Attachment[] = []): void {
        attachments.forEach(attachment => this.appendAttachment(attachment))
    }
    
    public appendAttendee(attendee?: Attendee): void {
        if (attendee) {
            const { address, cn, dir, sentBy, cu, member, role, partstat, rsvp, delegatedTo, delegatedFrom } = attendee
            const optionals = [
                cn ? `CN=${cn}` : '',
                dir ? `DIR=${dir}` : '',
                sentBy ? `CN=${sentBy}` : '',
                cu ? `CUTYPE=${cu}` : '',
                member ? `MEMBER=${member}` : '',
                role ? `ROLE=${role}` : '',
                partstat ? `PARTSTAT=${partstat}` : '',
                rsvp ? `RSVP=${rsvp}` : '',
                delegatedTo ? `DELEGATED-TO=${delegatedTo.join(',')}` : '',
                delegatedFrom ? `DELEGATED-FROM=${delegatedFrom.join(',')}` : ''
            ].filter(Boolean).join(';')

            this.append(optionals
                ? `ATTENDEE;${optionals}:${address}`
                : `ATTENDEE:${address}`)
        }
    }
    
    public appendAttendees(attendees: Attendee[] = []): void {
        attendees.forEach(attendee => this.appendAttendee(attendee))
    }
    
    public appendRelation(relation?: Relation): void {
        if (relation) {
            this.append(relation.type
                ? `RELATED-TO;RELTYPE=${relation.type}:${relation.value}`
                : `RELATED-TO:${relation.value}`)
        }
    }
    
    public appendRelations(relations: Relation[] = []): void {
        relations.forEach(relation => this.appendRelation(relation))
    }

    public appendTrigger(trigger?: Trigger): void {
        if (trigger) {
            const optional = trigger.related ? `RELATED=${trigger.related}` : null

            let value
            if (typeof trigger.value === 'string') { // DateTime
                // TODO: DateTime
                value = moment(trigger.value).format('YYYYMMDDTHHmmss')
            } else { // Duration
                value = this.formatDuration(trigger.value)
            }
            this.append(optional
                ? `TRIGGER;${optional}:${value}`
                : `TRIGGER:${value}`)
        }
    }
    
    public appendXprop(xProp?: XProp): void {
        this.append(xProp ? `X-${xProp.name}:${xProp.value}` : '')
    }
    
    public appendXprops(xProps: XProp[] = []): void {
        xProps.forEach(xProp => this.appendXprop(xProp))
    }
    
    public appendEvent(event?: Event): void {
        if (event) {
            this.append('BEGIN:VEVENT')
            this.appendDate('DTSTAMP', event.dtStamp)
            this.appendString('UID', event.uid)
            this.appendDate('DTSTART', event.start)
            this.appendString('CLASS', event.class)
            this.appendDate('CREATED', event.created)
            this.appendString('DESCRIPTION', event.description)
            this.appendGeoPosition(event.geo)
            this.appendDate('LAST-MODIFIED', event.lastModified)
            this.appendString('LOCATION', event.location)
            this.appendOrganizer(event.organizer)
            this.appendNumber('PRIORITY', event.priority)
            this.appendNumber('SEQUENCE', event.sequnce)
            this.appendString('STATUS', event.status)
            this.appendString('SUMMARY', event.summary)
            this.appendString('TRANSP', event.transp)
            this.appendString('URL', event.url)
            this.appendString('RECURRENCE-ID', event.recurrenceId)
            // TODO: Rule
            this.appendString('STATUS', event.rrule)
            this.appendDate('DTEND', event.end)
            this.appendDuration(event.duration)
            this.appendAttachments(event.attachments)
            this.appendAttendees(event.attendees)
            this.appendStrings('CATEGORIES', event.categories)
            this.appendString('COMMENT', event.comment)
            this.appendString('CONTACT', event.contact)
            this.appendDate('EXDATE', event.exdate)
            this.appendRelations(event.relatedTo)
            this.appendStrings('RESOURCES', event.resources)
            this.appendRDate(event.rdate)
            this.appendXprops(event.xProps)
            this.appendAlarms(event.alarms)
            this.append('END:VEVENT')
        }
    }
    
    public appendEvents(events: Event[] = []): void {
        events.forEach(event => this.appendEvent(event))
    }
    
    public appendTodo(todo?: Todo): void {
        throw new Error("Method not implemented.")
    }
    
    public appendTodos(todo?: Todo[]): void {
        throw new Error("Method not implemented.")
    }
    
    public appendJournal(journal?: Journal): void {
        throw new Error("Method not implemented.")
    }
    
    public appendJournals(journals?: Journal[]): void {
        throw new Error("Method not implemented.")
    }
    
    public appendFreeBusy(freebusy?: FreeBusy): void {
        throw new Error("Method not implemented.")
    }
    
    public appendFreeBusys(freebusy?: FreeBusy[]): void {
        throw new Error("Method not implemented.")
    }
    
    public appendTimeZone(timeZone?: TimeZone): void {
        throw new Error("Method not implemented.")
    }
    
    public appendTimeZones(timeZones?: TimeZone[]): void {
        throw new Error("Method not implemented.")
    }
    
    public appendAlarm(alarm?: Alarm): void {
        if (alarm) {
            this.append('BEGIN:VALARM')
            this.appendString('ACTION', alarm.action)
            this.appendTrigger(alarm.trigger)
            this.appendDuration(alarm.duration)
            this.appendNumber('REPEAT', alarm.repeat)
            this.appendString('DESCRIPTION', alarm.description)
            this.appendString('SUMMARY', alarm.summary)
            this.appendAttendees(alarm.attendee)
            this.appendAttachments(alarm.attach)
            this.appendXprops(alarm.xProps)
            this.append('END:VALARM')
        }
    }
    
    public appendAlarms(alarms: Alarm[] = []): void {
        alarms.forEach(alarm => this.appendAlarm(alarm))
    }

    private formatDuration(duration: Duration): string {
        const { before, week, day, hour, minute, second } = duration
        return [
            before ? '-' : '',
            'P',
            week ? `${week}W` : '',
            day ? `${day}D` : '',
            (hour || minute || second) ? 'T' : '',
            hour ? `${hour}H` : '',
            minute ? `${minute}M` : '',
            second ? `${second}S` : '',
        ]
          .filter(Boolean)
          .join('')
    }

}

export default Builder
